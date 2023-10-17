import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useGetRfidsQuery } from '@/slices/rfidApiSlice'
import { DataTable } from '@/components/global/dataTable'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { columns, RfidColumn, IRfidRow } from './columns'
import AddRfidModal from './addrfids';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
const CreateRFID = () => {
    const [data, setData] = useState<RfidColumn[]>([])
    const { data: rfids, refetch } = useGetRfidsQuery(null)

    useEffect(() => {
        if (rfids) {
            const tableData = rfids.map((data: IRfidRow) => ({
                id: data._id,
                rfidTag: data.rfidTag,
                status: data.status,
            }))
            setData(tableData)
        }
    }, [rfids, refetch]);

    useEffect(() => {
        const socket = io('http://127.0.0.1:3001');
        socket.on('new_rfid', (content) => {
            refetch();
            toast.success(`RFID Tag: ${content.rfidTag} added to list.`);
        })
        return () => {socket.disconnect()}
    }, [])
    return (
        <div className='flex flex-col gap-10 text-[#1e1e1e]'>
            <div className='flex w-full justify-between'>
                <h1 className='text-xl font-bold'>Manage RFIDs</h1>
            </div>

            <Card>
                <CardContent>
                    <DataTable columns={columns} data={data} columnSearch='rfidTag' component={<AddRfidModal/>
            }/>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateRFID
