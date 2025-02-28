import React from 'react'
import { columns } from "@/app/dashboard/columns";
import { DataTable } from "@/app/dashboard/data-table";
import { Fragment } from '@/utils/types';

const FragmentTable = ({data} : {data : Fragment[]}) => {
  return (
    <div>
        <DataTable columns={columns} data={data} />
    </div>
  )
}

export default FragmentTable
