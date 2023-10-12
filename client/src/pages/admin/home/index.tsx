import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
        Data Table Here
      </div>

    </div>
  )
}

export default Home