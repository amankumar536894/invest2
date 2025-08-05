import React from 'react'
import './EditInvestorDetails.css'
import { X, Trash } from 'lucide-react'

const EditInvestorDetails = ({edituserpopup, setEdituserpopup, formData, setFormData, onUpdate, onDelete, investmentPlans}) => {
  const handleUpdate = () => {
    console.log('Update button clicked')
    console.log('Current formData:', formData)
    
    // Basic validation - only name and phone number are required
    if (!formData.name || !formData.phoneNumber) {
      alert('Please fill in required fields: Name and Phone Number')
      return
    }

    if (onUpdate) {
      console.log('Calling onUpdate function')
      onUpdate()
    } else {
      console.error('onUpdate function is not provided')
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <>
      <div className={`editinvestordetails ${edituserpopup ? 'editinvestordetails-active' : ''}`} onClick={()=>{setEdituserpopup(false)}} >
        <div className="editinvestordetails-inner" onClick={(e)=>{e.stopPropagation()}}>
            <X className='editinxestorpopup-cross' onClick={()=>{setEdituserpopup(false)}} />
            <input 
                className='fullinputeditiman' 
                type='text' 
                placeholder='Enter Name'
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <div className='fullwidthouterinputeditman'>
                <select 
                    className='innerfullwidthman'
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <input 
                    className='innerfullwidthman' 
                    type='text' 
                    placeholder='Contact Number' 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
            </div>
            <div className='fullwidthouterinputeditman'>
                <input 
                    className='innerfullwidthman' 
                    type='text' 
                    placeholder='Street Address (Optional)' 
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, street: e.target.value}
                    })}
                />
                <input 
                    className='innerfullwidthman' 
                    type='text' 
                    placeholder='City (Optional)' 
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, city: e.target.value}
                    })}
                />
            </div>
            <div className='fullwidthouterinputeditman'>
                <input 
                    className='innerfullwidthman' 
                    type='text' 
                    placeholder='State (Optional)' 
                    value={formData.address.state}
                    onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, state: e.target.value}
                    })}
                />
                <input 
                    className='innerfullwidthman' 
                    type='text' 
                    placeholder='Pincode (Optional)' 
                    value={formData.address.pincode}
                    onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, pincode: e.target.value}
                    })}
                />
            </div>
            <div className='fullwidthouterinputeditman'>
                <input 
                    className='innerfullwidthman' 
                    type='text' 
                    placeholder='Bank Account Number (Optional)' 
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, accountNumber: e.target.value}
                    })}
                />
                <input 
                    className='innerfullwidthman' 
                    type='text' 
                    placeholder='IFSC Code (Optional)' 
                    value={formData.bankDetails.ifscCode}
                    onChange={(e) => setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, ifscCode: e.target.value}
                    })}
                />
            </div>
            <div className='fullwidthouterinputeditman'>
                <input 
                    className='innerfullwidthman' 
                    type='text' 
                    placeholder='Bank Name (Optional)' 
                    value={formData.bankDetails.bankName}
                    onChange={(e) => setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, bankName: e.target.value}
                    })}
                />
                <input 
                    className='innerfullwidthman' 
                    type='text' 
                    placeholder='Account Holder Name (Optional)' 
                    value={formData.bankDetails.accountHolderName}
                    onChange={(e) => setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, accountHolderName: e.target.value}
                    })}
                />
            </div>
            <div className='fullwidthouterinputeditman'>
                <input 
                    className='innerfullwidthman' 
                    type='number' 
                    placeholder='Total Money Invested' 
                    value={formData.totalMoneyInvested}
                    onChange={(e) => setFormData({...formData, totalMoneyInvested: e.target.value})}
                />
                <select 
                    className='innerfullwidthman'
                    value={formData.investmentPlan}
                    onChange={(e) => setFormData({...formData, investmentPlan: e.target.value})}
                >
                    <option value="">Select Investment Plan</option>
                    {investmentPlans.map((plan) => (
                        <option key={plan._id} value={plan._id}>
                            {plan.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className='fullwidthouterinputeditman'>
                <select 
                    className='innerfullwidthman'
                    value={formData.yearlyPlan}
                    onChange={(e) => setFormData({...formData, yearlyPlan: e.target.value})}
                >
                    <option value="">Select Yearly Plan</option>
                    <option value="basic">Basic Yearly Plan</option>
                    <option value="premium">Premium Yearly Plan</option>
                    <option value="elite">Elite Yearly Plan</option>
                    <option value="custom">Custom Yearly Plan</option>
                </select>
            </div>

            <div className='editinvestorbtns'>
                <p className='editinvestorbtns-delete' onClick={handleDelete}>
                    <Trash size={16} />
                    Delete
                </p>
                <p className='editinvestorbtns-cancel' onClick={()=>{setEdituserpopup(false)}}>Cancel</p>
                <p className='editinvestorbtns-update' onClick={handleUpdate}>Update Now</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default EditInvestorDetails
