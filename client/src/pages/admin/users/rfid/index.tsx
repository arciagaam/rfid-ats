import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useGetRfidsQuery } from '@/slices/rfidApiSlice'
import { DataTable } from '@/components/global/datatable/dataTable'
import { columns, Log, IRfidRow } from './columns'
import AddRfidModal from './addrfids'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

const CreateRFID = () => {
    const [data, setData] = useState<Log[]>([])
    const { data: rfids, refetch } = useGetRfidsQuery(null)
    console.log(data)

    useEffect(() => {
        if (rfids) {
            const tableData = rfids.map((data: IRfidRow) => ({
                id: data._id,
                rfidTag: data.rfidTag,
                user: data.user,
                status: data.status,
            }))
            setData(tableData)
            refetch()
        }
    }, [rfids, refetch])

    useEffect(() => {
        const socket = io('http://127.0.0.1:3001')
        socket.on('new_rfid', (content) => {
            refetch()
            toast.success(`RFID Tag: ${content.rfidTag} added to list.`)
        })
        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        const socket = io('http://127.0.0.1:3001')

        socket.on('new_rfid', (content) => {
            refetch()
            toast.success(`RFID Tag: ${content.rfidTag} added to list.`)
        })

        socket.on('rfid_assigned', ({ rfidTag, userId }) => {
            const updatedData = data.map((item) => {
                if (item.rfidTag === rfidTag) {
                    return {
                        ...item,
                        user: userId,
                        status: userId ? 'active' : 'not assigned',
                    }
                }
                return item
            })
            setData(updatedData)
        })

        return () => {
            socket.disconnect()
        }
    }, [data, refetch])

    return (
        <div className='flex flex-col gap-10 text-[#1e1e1e]'>
            <div className='flex w-full justify-between'>
                <h1 className='text-xl font-bold'>Manage RFIDs</h1>
            </div>

            <Card>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data}
                        columnSearch='rfidTag'
                        component={<AddRfidModal />}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateRFID
