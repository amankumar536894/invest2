import React from 'react'
import './DeletePlanPopup.css'
import { X } from 'lucide-react'

const DeletePlanPopup = ({deleteplanpopup, setDeleteplanpopup, onDelete}) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <>
      <div className="deleteplanpopup" style={{display: deleteplanpopup ? 'flex' : 'none'}} onClick={() => setDeleteplanpopup(false)}>
        <div className="deleteplanpopup-content" onClick={(e) => e.stopPropagation()}>
            <X className='deleteplanpopup-content-close' onClick={() => setDeleteplanpopup(false)}/>
            <p className='deleteplanpopup-content-title'>Are you sure you want to delete this plan?</p>
            <div className="deleteplanpopup-content-buttons">
                <button className="deleteplanpopup-content-buttons-cancel" onClick={() => setDeleteplanpopup(false)}>Cancel</button>
                <button className="deleteplanpopup-content-buttons-delete" onClick={handleDelete}>Delete</button>
            </div>
        </div>
      </div>
    </>
  )
}

export default DeletePlanPopup
