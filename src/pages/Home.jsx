import React from 'react'
import Form from '../components/Form';
import Input from '../components/Input'
import Button from '../components/Button'
import Footer from '../components/Footer'
import { IoSearch } from "react-icons/io5";

export default function Home() {
  return (
    <div className='flex items-center justify-center'>
      <Form className={"!bg-transparent !shadow-none !border-none !rounded-none"} fields={[
        <Input type={"text"}
         name={"search"} icon={<IoSearch className='text-2xl text-gray-600'/>} placeholder={"Buscar"}/>
      ]}/>
    </div>
  );
}
