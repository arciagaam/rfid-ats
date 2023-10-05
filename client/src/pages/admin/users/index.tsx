
import { Label } from "@/components/ui/label"

import { DataTable } from "../../../components/global/dataTable"
import { Log, columns } from "./columns"
import { useEffect, useState } from "react"

const Users = () => {

  const [ data, setData ] = useState<Array<Log>>([]);

  useEffect(() => {
    
    async function getData() {
      // Fetch data from your API here.
      setData([
        {
          id: '1',
          name: 'Ken Sagala',
          date_time: 'Test Dates',
          status: 'active'
        },
        {
          id: '2',
          name: 'Miguel Arciaga',
          date_time: 'Test Dates',
          status: 'inactive'
        },
      ])
    }
    
    getData();
    
  }, [])



  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-xl font-bold">Users</h1>
      <DataTable columns={columns} data={data}/>
    </div>
  )
}

export default Users