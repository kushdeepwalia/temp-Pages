import { use, useEffect, useState } from "react";

// Icons:
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Button from "../Button";
import { filter } from "jszip";

const OrganizationTable = (props) => {

  // Pagination is not fully implimented
  const [filterWord, setFilterWord] = useState("")
  const [filteredData, setFilteredData] = useState(props.data)

  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPage] = useState(Math.ceil((filteredData?.length || 0) / pageSize))
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedData, setPaginatedData] = useState(props.data?.slice((currentPage - 1) * pageSize, currentPage * pageSize))

  const filterData = (word = "") => {
    // Get the filtered Data
    setFilterWord(word)
    setFilteredData(props.data.filter(obj => obj.org_name.toLowerCase().includes(word.toLowerCase())))
  }

  useEffect(() => {
    setFilteredData(props.data.filter(obj => obj.org_name.toLowerCase().includes(filterWord.toLowerCase())))
  }, [props.data])

  useEffect(() => {
    const newTotalPages = Math.ceil((filteredData?.length || 0) / pageSize)
    setTotalPage( newTotalPages ? newTotalPages : 1)
    setCurrentPage(1);
    setPaginatedData(filteredData?.slice((currentPage - 1) * pageSize, currentPage * pageSize))
  }, [filteredData, pageSize])

  useEffect(() => {
    setPaginatedData(filteredData?.slice((currentPage - 1) * pageSize, currentPage * pageSize))
  }, [currentPage])

  return <>
    <div className="overflow-auto">
      <input type='text' className="border p-2 m-4 rounded" value={filterWord} placeholder="Search" onChange={(e) => { filterData(e.target.value) }} />
      <table>
        <thead>
          <tr>
            <th className="h-12 px-4 text-left align-middle">
              S.No
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Name
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Admin
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Project
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Parent Organization
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {
            paginatedData?.map((rowData, i) => (
              <tr key={"table-row-" + i}>
                <td className="h-12 px-4 text-left align-middle">{(i + 1) + (currentPage-1) * pageSize}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.org_name}</td>
                <td className="h-12 px-4 text-left align-middle">{props?.adminData[rowData.org_name]?.length || 0}</td>
                <td className="h-12 px-4 text-left align-middle">{props?.projectData[rowData.org_name]?.length || 0}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.parent_org_name === null ? "----------" : rowData.parent_org_name}</td>
                <td className="h-12 px-4 text-left align-middle">
                  {
                    Number(rowData.tenant_id) !== 1 ?
                      <div className="flex gap-[8px]">
                        <FaRegEdit onClick={() => props.setEditableId(rowData.tenant_id)} className="hover:cursor-pointer" />
                        <MdDeleteOutline onClick={() => props.handleDelete(rowData.tenant_id, rowData.org_name)} className="hover:cursor-pointer" />
                      </div>
                      :
                      <></>
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            <td colSpan='6' className="items-center">
                <div className="flex justify-evenly gap-4 items-center">
                    <p className="block">Entries: {filteredData.length}</p>
                    <p className="block">Current Page: {currentPage}</p>
                    <p className="block">Total Pages: {totalPages ? totalPages : 1}</p>
                    <select id="page-size"
                        value={pageSize}
                        onChange={(e) => {setPageSize(e.target.value)}}
                        className="border px-2 py-1 rounded"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={99999}>All</option>
                    </select>
                    <button className={(currentPage === 1) ? "bg-gray-100 text-gray-300 px-4 py-2 rounded" : "bg-gray-300 px-4 py-2 rounded hover:cursor-pointer"}
                            disabled={(currentPage === 1)}
                            onClick={ () => {
                                setCurrentPage(currentPage-1)
                            }
                        }>
                            {"<"}
                    </button>
                    <button className={(currentPage === totalPages) ? "bg-gray-100 text-gray-300 px-4 py-2 rounded" : "bg-gray-300 px-4 py-2 rounded hover:cursor-pointer"}
                            disabled={(currentPage === totalPages)}
                            onClick={ () => {
                                setCurrentPage(currentPage+1)
                            }
                        }>
                            {">"}
                    </button>
                </div>
            </td>
            {/* <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  'aria-label': 'rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
          </tr>
        </tfoot>
      </table>
    </div>
  </>
}

export default OrganizationTable