import React, {useState} from 'react'
import './Creations.css'
import SelectDropdown from '../Dropdown/SelectDropdown';
import { Link, useNavigate } from "react-router-dom"



const Creations = () => {

   const nav = useNavigate()
 
  const handleProjectClick = () => {
    nav('/img')

  }
 
  
  const handleSelectChange = (value) => {
    console.log('Selected value:', value);
  };

  const handleSuggestClick = () => {
    console.log('Nav to /suggest:')
    nav('/suggest')
  }


  return (
        
    <div id='CreationsComp'>
        <h1 className='whits'>
           👕 Whitney's Unique Creations 👚
            </h1>
        
        {/* <br /> */}
            <h2 className='whits2'>
           Creations You Want
             </h2>
        
        <div className='creations'>
            <button className='pics' onClick={() => handleProjectClick()}>SEE CREATIONS</button>
            </div>

            <br />

             <h4 className='projs'>
                The Place That Lets You Customize 
                </h4>
        
            {/* <br /> */}
        
             <h5 className='projs'>
                What You Want!!
                </h5>
                        
             <h5 className='projs'>
             How You Want It!!
             </h5>
        
                    <h5 className='projs'>
                 When You Want It!!
             </h5>
        {/* </div> */}

  <br />    
             {/* <br /> */}

             <div id='suggestions'>

              <p id='Challenge'>Challenge Our Creators!!</p>

              <p className='ideas'> See If Our Creators Can </p>
              
              <p className='ideas'>
                 Make Your Ideas Come To Life </p>

              <p className='ideas'> 
                Just Click Below To Get Started:</p>

              <br />

              <button className='sCard' onClick={handleSuggestClick}>What's Your Creation Idea?</button>
             </div>


    {/* <SelectDropdown
    id='selectDD'
        options={[
         { value: 'option1', label: 'Option 1' },
         { value: 'option2', label: 'Option 2' },
         { value: 'option3', label: 'Option 3' },
         { value: 'option4', label: 'Option 4' },
         { value: 'option5', label: 'Option 5' },
         { value: 'option6', label: 'Option 6' }, */}

  {/* Add more options here
         ]}
           onSelectChange={handleSelectChange}
            /> */}

  </div>
  )
}

export default Creations