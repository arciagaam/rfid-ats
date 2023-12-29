import { DataTable } from '@/components/global/datatable/dataTable'
import { FormModalBtn } from '@/components/global/formModalBtn'
import { Card, CardContent } from '@/components/ui/card'
import { columns, Schedule } from './columns'
import { useEffect, useState } from 'react'
import ScheduleForm from '@/util/scheduleform'
import { useGetUsersWithScheduleQuery } from '@/slices/usersApiSlice'

const FacultySchedule = () => {
    const [data, setData] = useState([])

    const { data: usersWithSchedule, refetch } = useGetUsersWithScheduleQuery(null)

    useEffect(() => {
        if (usersWithSchedule) {
            const tableData = usersWithSchedule.map((user) => {
                return {
                    id: user._id,
                    name: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
                }
            })
            setData(tableData)
        }

        refetch()
    }, [usersWithSchedule, refetch])

    return (
        <div className='flex flex-col gap-10 text-[#1e1e1e]'>
            <div className='flex w-full justify-between'>
                <h1 className='text-xl font-bold'>Faculty Schedule</h1>
            </div>

            <Card>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data}
                        searchPlaceholder='Search name...'
                        component={[
                            <FormModalBtn
                                btnLabel='Create Schedule'
                                dlgTitle='Create Schedule'
                                formComponent={<ScheduleForm isEdit={false} />}
                            />,
                        ]}
                        columnSearch='name'
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default FacultySchedule
