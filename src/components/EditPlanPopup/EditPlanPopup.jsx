import React from 'react'
import './EditPlanPopup.css'
import { X } from 'lucide-react'

const EditPlanPopup = ({editplanpopup, setEditplanpopup, formData, setFormData, onUpdate}) => {
  const handleUpdate = () => {
    console.log('Update button clicked')
    console.log('Current formData:', formData)
    if (onUpdate) {
      console.log('Calling onUpdate function')
      onUpdate()
    } else {
      console.error('onUpdate function is not provided')
    }
  }

  return (
    <>
      <div className={`editplanpopup ${editplanpopup ? 'editplanpopupactive' : ''}`} onClick={()=>{setEditplanpopup(false)}}>
        <div className="editplanpopup-content" onClick={(e) => e.stopPropagation()}>
            <X className='editplanpopup-content-close' onClick={()=>{setEditplanpopup(false)}}/>
            <div className='editplanpopup-inputfull'>
                <input 
                    className='editplanpopup-inputfull-input' 
                    type='text' 
                    placeholder='Plan Name' 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <select 
                    className='editplanpopup-inputfull-input'
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <div className="editplanpopup-inputfull">
                <input 
                    className='editplanpopup-inputfull-input' 
                    type='number' 
                    placeholder='Minimum Range' 
                    value={formData.minInvestment}
                    onChange={(e) => setFormData({...formData, minInvestment: e.target.value})}
                />
                <input 
                    className='editplanpopup-inputfull-input' 
                    type='number' 
                    placeholder='Maximum Range' 
                    value={formData.maxInvestment}
                    onChange={(e) => setFormData({...formData, maxInvestment: e.target.value})}
                />
            </div>
            <div className="editplanpopup-inputfull">
                <input 
                    className='editplanpopup-inputfull-input' 
                    type='number' 
                    step="0.1"
                    placeholder='Enter ROI' 
                    value={formData.returnMultiplier}
                    onChange={(e) => setFormData({...formData, returnMultiplier: e.target.value})}
                />
                <input 
                    className='editplanpopup-inputfull-input' 
                    type='number' 
                    placeholder='Enter Timeperiod (Months)' 
                    value={formData.durationMonths}
                    onChange={(e) => setFormData({...formData, durationMonths: e.target.value})}
                />
            </div>
            <div className="editplanpopup-inputfull">
                <select 
                    className='editplanpopup-inputfull-input'
                    value={formData.roiPaymentFrequency}
                    onChange={(e) => setFormData({...formData, roiPaymentFrequency: e.target.value})}
                >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="End of Term">End of Term</option>
                </select>
                <input 
                    className='editplanpopup-inputfull-input' 
                    type='text' 
                    placeholder='Description' 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>
            <div className='editplanpopup-btns'>
                <p className='editplanpopup-btns-cancel' onClick={() => setEditplanpopup(false)}>Cancel</p>
                <p className='editplanpopup-btns-update' onClick={handleUpdate}>Update Now</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default EditPlanPopup
