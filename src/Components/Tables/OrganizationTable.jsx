import { useEffect, useState } from "react";

// Icons:
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const OrganizationTable = (props) => {

    // Pagination is not fully implimented
    const [filterWord, setFilterWord] = useState("")
    const [filteredData, setFilteredData] = useState(props.data)

    const [pageSize, setPageSize] = useState(5)
    const [totalPages, setTotalPage] = useState(Math.ceil(filteredData.length/pageSize))
    const [currentPage, setCurrentPage] = useState(1)
    const [paginatedData, setPaginatedData] = useState(props.data.slice((currentPage - 1) * pageSize, currentPage * pageSize))


    const filterData = (word) => {
        // Get the filtered Data
        setFilterWord(word.toLowerCase())
        setFilteredData(props.data.filter(obj => obj.Name.toLowerCase().includes(filterWord)))
    }
    useEffect(() => {
        console.log(filteredData)
        setCurrentPage(1)
        setTotalPage(Math.ceil(filteredData.length/pageSize))
        setPaginatedData(props.data.filter(obj => obj.Name.toLowerCase().includes(filterWord)).slice((currentPage - 1) * pageSize, currentPage * pageSize))
    } ,[filteredData])

    useEffect(() => {
        setPaginatedData(filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize))
    }, [currentPage])

    return <>
    <div>
        <input type='text' className="border-b border-2" value={filterWord} placeholder="Search" onChange={(e) => {filterData(e.target.value)}} />
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
                        Action
                    </th>
                </tr>
            </thead>    
            <tbody>
                {
                    // Mapp obtained data to the table

                    paginatedData.map((rowData, i) => (
                        <tr key={"table-row-" + i}>
                            <td className="h-12 px-4 text-left align-middle">{i + 1}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Name}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Admin}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Project}</td>
                            <td className="h-12 px-4 text-left align-middle">
                                <div className="flex gap-[8px]">
                                    <FaRegEdit className="hover:cursor-pointer"/>
                                    <MdDeleteOutline className="hover:cursor-pointer"/>
                                </div>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan='5'>
                        <p>Curret Page: {currentPage}</p>
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