import { useEffect, useState } from "react";

// Icons:
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const OrganizationTable = (props) => {

  // Pagination is not fully implimented
  const [filterWord, setFilterWord] = useState("")
  const [filteredData, setFilteredData] = useState(props.data)

  const [pageSize, setPageSize] = useState(100)
  const [totalPages, setTotalPage] = useState(Math.ceil(filteredData.length / pageSize))
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedData, setPaginatedData] = useState(props.data.slice((currentPage - 1) * pageSize, currentPage * pageSize))

  const filterData = (word) => {
    // Get the filtered Data
    setFilterWord(word?.toLowerCase())
    setFilteredData(props.data.filter(obj => obj.org_name.toLowerCase().includes(filterWord)))
  }
  useEffect(() => {
    if (filterWord) {
      filterData(filterWord);
    }
    setCurrentPage(1)
    setTotalPage(Math.ceil(filteredData.length / pageSize))
    setPaginatedData(props.data.filter(obj => obj.org_name.toLowerCase().includes(filterWord)).slice((currentPage - 1) * pageSize, currentPage * pageSize))
  }, [filterWord])

  useEffect(() => {
    setPaginatedData(filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize))
  }, [currentPage])

  return <>
    <div>
      <input type='text' className="border-b border-2" value={filterWord} placeholder="Search" onChange={(e) => { setFilterWord(e.target.value) }} />
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
            {/* <th className="h-12 px-4 text-left align-middle">
              Action
            </th> */}
          </tr>
        </thead>
        <tbody>
          {
            // Mapp obtained data to the table

            paginatedData.map((rowData, i) => (
              <tr key={"table-row-" + i}>
                <td className="h-12 px-4 text-left align-middle">{i + 1}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.org_name}</td>
                <td className="h-12 px-4 text-left align-middle">{props?.adminData[rowData.org_name]?.length || 0}</td>
                <td className="h-12 px-4 text-left align-middle">{props?.projectData[rowData.org_name]?.length || 0}</td>
                {/* <td className="h-12 px-4 text-left align-middle">
                  <div className="flex gap-[8px]">
                    <FaRegEdit className="hover:cursor-pointer" />
                    <MdDeleteOutline className="hover:cursor-pointer" />
                  </div>
                </td> */}
              </tr>
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            {/* <td colSpan='5'>
                        <p>Curret Page: {currentPage}</p>
                    </td> */}
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