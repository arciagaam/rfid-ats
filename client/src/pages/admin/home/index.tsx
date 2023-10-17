import { DataTable } from '@/components/global/dataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <div className="flex flex-col gap-5">

      <div className="flex gap-5">
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>Number of Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>

        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>Pending AR</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>

        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>Accomplished AR</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex">
        <Card>
          {/* <CardContent>
            <DataTable
              columns={columns}
              data={data}
              component={[
                <Button asChild className='mr-2'>
                  <Link to='register'>Add User</Link>
                </Button>,

                <Button asChild className='ml-2'>
                  <Link to='rfid'>Add RFID</Link>
                </Button>,
              ]}
            />
          </CardContent> */}
        </Card>
      </div>

    </div>
  )
}

export default Home