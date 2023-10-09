import { useGetUserQuery } from '@/slices/usersApiSlice';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { Log } from './columns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
const ShowUser = () => {

  type UserProfile = {
    fullname: string,
    email: string,
    role: string,
    department: string,
    status: string,
    idNumber: string,
    rfid: string,
    birthdate: string,
    sex: string,
    contactNumber: string,
    address: string
  }

  const [profile, setProfile] = useState<UserProfile>();

  const { id } = useParams();
  const { data: user } = useGetUserQuery(id);
  const navigate = useNavigate();

  function formatDate(date = new Date()) {
    const year = date.toLocaleString('default', { year: 'numeric' });
    const month = date.toLocaleString('default', {
      month: '2-digit',
    });
    const day = date.toLocaleString('default', { day: '2-digit' });

    return [year, month, day].join('-');
  }

  useEffect(() => {
    if (user) {
      const data = {
        fullname: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
        idNumber: user.idNumber ?? 'N/A',
        rfid: user.rfid ?? 'N/A',
        birthdate: formatDate(new Date(user.birthdate)),
        sex: user.sex,
        contactNumber: user.contactNumber,
        address: user.address
      }
      setProfile(data);
    }
  }, [user]);


  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <button className='flex gap-2 items-center hover:underline ' onClick={() => { navigate('/admin/users') }}>
            <BiArrowBack />
            Back to Users
          </button>
          <h1 className='text-lg font-bold'>User Profile</h1>
        </div>

        <div className="grid grid-cols-3 gap-5">

          <div className="flex flex-col gap-1 col-span-2">
            <Label htmlFor='fullName'>Full Name</Label>
            <Input className='!cursor-default' id='fullName' value={profile?.fullname} disabled />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor='role'>Role</Label>
            <Input className='!cursor-default' id='role' value={profile?.role.toUpperCase()} disabled />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <Label htmlFor='fullName'>Email</Label>
            <Input className='!cursor-default' id='fullName' value={profile?.email} disabled />
          </div>

          <div></div>

          {
            profile?.role == 'faculty' ?
              <>
                <div className="flex flex-col gap-1">
                  <Label htmlFor='idNumber'>ID Number</Label>
                  <Input className='!cursor-default' id='idNumber' value={profile?.idNumber} disabled />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor='rfid'>RFID</Label>
                  <Input className='!cursor-default' id='rfid' value={profile?.rfid} disabled />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor='status'>Status</Label>
                  <Input className='!cursor-default' id='status' value={profile?.status.toUpperCase()} disabled />
                </div>


                <div className="flex flex-col gap-1">
                  <Label htmlFor='birthdate'>Birth Date</Label>
                  <Input className='!cursor-default' id='birthdate' value={profile?.birthdate} disabled />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor='sex'>Sex</Label>
                  <Input className='!cursor-default' id='sex' value={profile?.sex.toUpperCase()} disabled />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor='contactNumber'>Contact Number</Label>
                  <Input className='!cursor-default' id='contactNumber' value={profile?.contactNumber} disabled />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor='department'>Department</Label>
                  <Input className='!cursor-default' id='department' value={profile?.department.toUpperCase()} disabled />
                </div>
              </>
              :
              null
          }

        </div>
      </div>

    </div>
  )
}

export default ShowUser