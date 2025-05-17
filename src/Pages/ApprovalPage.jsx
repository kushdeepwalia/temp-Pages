import React, { useState } from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import Body from '../Components/Body'
import { TfiReload } from 'react-icons/tfi'
import { queryClient } from '../utils/reactQuery'
import { FaPlus } from 'react-icons/fa'
import api from '../api'
import { useQuery } from '@tanstack/react-query'
import ApprovalTable from '../Components/Tables/ApprovalTable'

const ApprovalPage = () => {
  const { data: tenantId } = useQuery({
    queryKey: ['tenantId'],
    queryFn: async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user.tenant_id
    },
  });
  const { data: approvals, isLoading: approvalLoading, } = useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      const res = await api.get(`/auth/user/approvals`);
      return res.data;
    },
    enabled: !!tenantId
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/auth/user/bulk-import", formData); // Your API endpoint
      setResult({
        successCount: res.data.successCount,
        failedCount: res.data.failedCount,
      });
      if (res.data.successCount && res.data.successCount != 0) {
        await queryClient.invalidateQueries({
          queryKey: ['approvals']
        })
      }
    } catch (err) {
      setResult({ successCount: 0, failedCount: 0 });
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex">
        <SideBar activate="approval" />
        <Body>
          <div className="flex flex-col w-full h-full">
            <div className="bg-slate-100 h-[68px] flex justify-between items-center px-4">
              <h2>User Approvals</h2>
              <div className="flex gap-4 items-center">
                <TfiReload onClick={async () => await queryClient.invalidateQueries({
                  queryKey: ['approvals']
                })} className="hover:cursor-pointer" />
                <div className="flex items-center cursor-pointer" onClick={() => setShowModal(true)}>
                  <p className="pr-1">Add</p>
                  <FaPlus />
                </div>
              </div>
            </div>
            <ApprovalTable data={approvals || []} />
          </div>
        </Body>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Import Users via CSV</h2>

            <div className="space-y-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={uploading}
              />

              <span
                className="text-blue-600 underline text-sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = 'https://manorama.adminportal.anganwaditest.co.in/auth/download-sample/'; // Update this to match your backend route
                  link.setAttribute('download', 'sample.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download sample CSV
              </span>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? "Uploading..." : "Submit CSV"}
              </button>

              {result && (
                <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
                  ✅ Success Count: <strong>{result.successCount}</strong><br />
                  ❌ Failed Count: <strong>{result.failedCount}</strong>
                </div>
              )}
            </div>

            {/* Modal close only if not uploading */}
            {!uploading && (
              <button
                onClick={() => {
                  setShowModal(false)
                  setFile(null);
                  setUploading(false)
                  setResult(null)
                }}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ApprovalPage