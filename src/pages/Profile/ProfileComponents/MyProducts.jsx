import { Link } from 'lucide-react'
import React from 'react'

function MyProducts() {
  return (
    <div>
      <div className='w-full'>
        <button className='bg-[#46A358] flex rounded-md items-center justify-center gap-1 text-base text-white ml-auto px-[15px] py-[8px]'>Add new</button>
        <div className='pb-[11px] border-b border-[#46A35880] flex max-lg:hidden'>
          <h3 className='w-[40%]'>Products</h3>
          <h3 className='w-[20%]'>Price</h3>
          <h3 className='w-[40%]'>Total</h3>
        </div>
      </div>
    </div>
  )
}

export default MyProducts