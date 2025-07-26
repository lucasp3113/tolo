import React from 'react'
import Form from '../components/Form';
import Input from '../components/Input'
import { IoSearch } from "react-icons/io5";
import Tes from '../components/Tes';



export default function Home() {
  return (
    <div className='flex items-center justify-center'>
      <Form className={"!bg-transparent !shadow-none !border-none !rounded-none"} fields={[
        <Input type={"text"}
         name={"search"} className='pr-10' icon={<IoSearch className='text-2xl text-gray-600'/>} placeholder={"Buscar"}/>
      ]}/>
      <Tes/>
    </div>
  )
}
