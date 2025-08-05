import React, { useState, useEffect } from 'react'
import './InvestorsSection.css'
import { Plus, Search, TrendingUp, SquarePen, UserPen, Calendar, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import EditInvestorDetails from '../EditInvestorDetails/EditInvestorDetails'
import Statement from '../Statement/Statement'

const InvestorsSection = () => {
    const [investors, setInvestors] = useState([])
    const [stats, setStats] = useState({
        totalInvestors: 0,
        activeInvestors: 0,
        thisMonthInvestors: 0,
        growthRate: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [adduserpopup, setAdduserpopup] = useState(false)
    const [edituserpopup, setEdituserpopup] = useState(false)
    const [openStatement, setOpenStatement] = useState(false)
    const [selectedInvestor, setSelectedInvestor] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [investmentPlans, setInvestmentPlans] = useState([])
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [creditPopup, setCreditPopup] = useState(false)
    const [selectedInvestorForCredit, setSelectedInvestorForCredit] = useState(null)
    const [creditAmount, setCreditAmount] = useState('')
    const [creditNotes, setCreditNotes] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        bankDetails: {
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            accountHolderName: ''
        },
        totalMoneyInvested: '',
        investmentPlan: '',
        status: 'active'
    })
    const { token } = useAuth()

    useEffect(() => {
        console.log('InvestorsSection useEffect triggered, token:', !!token)
        fetchInvestors()
        fetchStats()
        fetchInvestmentPlans()
    }, [token])

    const fetchInvestors = async () => {
        console.log('InvestorsSection fetchInvestors called, token exists:', !!token)
        if (!token) {
            console.log('No token available, returning early')
            return
        }

        try {
            setIsLoading(true)
            console.log('Making API request to:', `${import.meta.env.VITE_BACKEND_URL}/api/investors`)
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investors`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            console.log('Response status:', response.status)
            if (response.ok) {
                const data = await response.json()
                console.log('Investors data received:', data)
                setInvestors(data.data || [])
                setError('') // Clear any previous errors
            } else {
                const errorData = await response.json()
                console.error('Failed to fetch investors:', errorData)
                setError('Failed to load investors. Please refresh the page.')
            }
        } catch (error) {
            console.error('Error fetching investors:', error)
            setError('Network error. Please check your connection and refresh the page.')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStats = async () => {
        if (!token) return

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investors/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                setStats(data.data || {})
            } else {
                console.error('Failed to fetch stats')
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const fetchInvestmentPlans = async () => {
        if (!token) return

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investment-plans`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                // Filter out deleted plans and only show active plans
                const activePlans = (data.data || []).filter(plan => 
                    !plan.isDeleted && plan.status === 'Active'
                )
                setInvestmentPlans(activePlans)
            } else {
                console.error('Failed to fetch investment plans')
            }
        } catch (error) {
            console.error('Error fetching investment plans:', error)
        }
    }

    const handleCreateInvestor = async () => {
        if (!token) return

        // Basic validation - only name and phone number are required
        if (!formData.name || !formData.phoneNumber) {
            alert('Please fill in required fields: Name and Phone Number')
            return
        }

        const initialInvestment = parseInt(formData.totalMoneyInvested) || 0

        try {
            // First, create the investor
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investors`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    email: 'temp@gmail.com', // Always send temp email to backend
                    address: formData.address.street || formData.address.city || formData.address.state || formData.address.pincode ? formData.address : '',
                    bankDetails: formData.bankDetails.accountNumber || formData.bankDetails.ifscCode || formData.bankDetails.bankName || formData.bankDetails.accountHolderName ? {
                        accountNumber: formData.bankDetails.accountNumber || '',
                        ifscCode: formData.bankDetails.ifscCode || '',
                        bankName: formData.bankDetails.bankName || '',
                        accountHolderName: formData.bankDetails.accountHolderName || ''
                    } : '',
                    totalMoneyInvested: 0, // Start with 0, will be updated by credit transaction
                    investmentPlan: formData.investmentPlan || null,
                    yearlyPlan: formData.yearlyPlan || null, // Add yearly plan to backend
                    status: formData.status,
                    isDeleted: false,
                    joinDate: new Date().toISOString()
                })
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Investor created:', data)
                
                // If there's an initial investment amount, create a credit transaction
                if (initialInvestment > 0) {
                    try {
                        const creditResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investors/${data.data._id}/credit`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                amount: initialInvestment,
                                notes: 'Initial investment amount'
                            })
                        })

                        if (creditResponse.ok) {
                            console.log('Initial credit transaction created successfully')
                            // Show success message for the credit transaction
                            setSuccessMessage(`Investor created successfully! Initial investment of ${formatCurrency(initialInvestment)} has been credited.`)
                        } else {
                            console.error('Failed to create initial credit transaction')
                            setError('Investor created but failed to credit initial investment. Please credit manually.')
                        }
                    } catch (creditError) {
                        console.error('Error creating initial credit transaction:', creditError)
                        setError('Investor created but failed to credit initial investment. Please credit manually.')
                    }
                }

                setError('') // Clear any previous errors
                setAdduserpopup(false)
                resetFormData()
                fetchInvestors() // Refresh the investors list
                fetchStats() // Refresh stats
                
                // Show success message
                if (initialInvestment > 0) {
                    setSuccessMessage(`Investor created successfully! Initial investment of ${formatCurrency(initialInvestment)} has been credited.`)
                } else {
                    setSuccessMessage('Investor created successfully!')
                }
                
                // Auto-dismiss success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage('')
                }, 5000)
            } else {
                const errorData = await response.json()
                console.error('Failed to create investor:', errorData)
                setError(errorData.message || 'Failed to create investor. Please try again.')
            }
        } catch (error) {
            console.error('Error creating investor:', error)
            setError('Network error. Please check your connection and try again.')
        }
    }

    const handleEditInvestor = (investor) => {
        setSelectedInvestor(investor)
        setFormData({
            name: investor.name,
            phoneNumber: investor.phoneNumber,
            email: '', // Always show empty email in edit form
            address: investor.address || {
                street: '',
                city: '',
                state: '',
                pincode: ''
            },
            bankDetails: investor.bankDetails || {
                accountNumber: '',
                ifscCode: '',
                bankName: '',
                accountHolderName: ''
            },
            totalMoneyInvested: investor.totalMoneyInvested.toString(),
            investmentPlan: investor.investmentPlan?._id || investor.investmentPlan || '',
            yearlyPlan: investor.yearlyPlan || '', // Add yearly plan from investor data
            status: investor.status
        })
        setError('') // Clear any previous errors
        setEdituserpopup(true)
    }

    const handleUpdateInvestor = async () => {
        if (!token || !selectedInvestor) {
            console.error('Missing token or selectedInvestor:', { token: !!token, selectedInvestor: !!selectedInvestor })
            return
        }

        // Basic validation - only name and phone number are required
        if (!formData.name || !formData.phoneNumber) {
            setError('Please fill in required fields: Name and Phone Number')
            return
        }

        // Bank details are optional - no validation needed

        try {
            console.log('Updating investor with data:', {
                investorId: selectedInvestor._id,
                formData: formData
            })

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investors/${selectedInvestor._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    email: 'temp@gmail.com', // Always send temp email to backend
                    address: formData.address.street || formData.address.city || formData.address.state || formData.address.pincode ? formData.address : '',
                    bankDetails: formData.bankDetails.accountNumber || formData.bankDetails.ifscCode || formData.bankDetails.bankName || formData.bankDetails.accountHolderName ? {
                        accountNumber: formData.bankDetails.accountNumber || '',
                        ifscCode: formData.bankDetails.ifscCode || '',
                        bankName: formData.bankDetails.bankName || '',
                        accountHolderName: formData.bankDetails.accountHolderName || ''
                    } : '',
                    totalMoneyInvested: parseInt(formData.totalMoneyInvested),
                    investmentPlan: formData.investmentPlan || null,
                    yearlyPlan: formData.yearlyPlan || null, // Add yearly plan to backend
                    status: formData.status
                })
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Investor updated successfully:', data)
                setError('') // Clear any previous errors
                setEdituserpopup(false)
                setSelectedInvestor(null)
                fetchInvestors() // Refresh the investors list
                fetchStats() // Refresh stats
            } else {
                const errorData = await response.json()
                console.error('Failed to update investor:', errorData)
                setError(errorData.message || 'Failed to update investor. Please try again.')
            }
        } catch (error) {
            console.error('Error updating investor:', error)
            setError('Network error. Please check your connection and try again.')
        }
    }

    const resetFormData = () => {
        const newFormData = {
            name: '',
            phoneNumber: '',
            email: '', // Keep empty for consistency
            address: {
                street: '',
                city: '',
                state: '',
                pincode: ''
            },
            bankDetails: {
                accountNumber: '',
                ifscCode: '',
                bankName: '',
                accountHolderName: ''
            },
            totalMoneyInvested: '',
            investmentPlan: '',
            yearlyPlan: '', // Add yearly plan field
            status: 'active'
        }
        setFormData(newFormData)
    }

    const handleAddInvestorClick = () => {
        resetFormData()
        setAdduserpopup(true)
        setSuccessMessage('') // Clear any previous success message
        setError('') // Clear any previous error message
    }

    const handleCloseAddPopup = () => {
        setAdduserpopup(false)
        resetFormData()
    }

    const handleDeleteInvestor = async () => {
        if (!token || !selectedInvestor) return

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investors/${selectedInvestor._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                console.log('Investor deleted successfully')
                setError('') // Clear any previous errors
                setEdituserpopup(false)
                setSelectedInvestor(null)
                fetchInvestors() // Refresh the investors list
                fetchStats() // Refresh stats
            } else {
                const errorData = await response.json()
                console.error('Failed to delete investor:', errorData)
                setError(errorData.message || 'Failed to delete investor. Please try again.')
            }
        } catch (error) {
            console.error('Error deleting investor:', error)
            setError('Network error. Please check your connection and try again.')
        }
    }

    const handleCreditAmountChange = (investorId, amount) => {
        if (amount && amount > 0) {
            setSelectedInvestorForCredit(investors.find(inv => inv._id === investorId))
            setCreditAmount(amount.toString())
            setCreditNotes('')
            setCreditPopup(true)
            setError('') // Clear any previous errors
        } else {
            setError('Please enter a valid amount greater than 0')
        }
    }

    const handleCreditSubmit = async () => {
        if (!token || !selectedInvestorForCredit || !creditAmount) {
            setError('Please enter the amount to credit')
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investors/${selectedInvestorForCredit._id}/credit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: parseInt(creditAmount),
                    notes: creditNotes || 'Credit transaction'
                })
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Credit successful:', data)
                setError('') // Clear any previous errors
                setCreditPopup(false)
                setSelectedInvestorForCredit(null)
                setCreditAmount('')
                setCreditNotes('')
                fetchInvestors() // Refresh the investors list
                fetchStats() // Refresh stats
            } else {
                const errorData = await response.json()
                console.error('Failed to credit amount:', errorData)
                setError(errorData.message || 'Failed to credit amount. Please try again.')
            }
        } catch (error) {
            console.error('Error crediting amount:', error)
            setError('Network error. Please check your connection and try again.')
        }
    }

    const formatCurrency = (amount) => {
        const numAmount = Number(amount) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(numAmount)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-IN')
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    }

    const filteredInvestors = investors.filter(investor => {
        if (!investor) return false;
        
        const name = investor.name || '';
        const phoneNumber = investor.phoneNumber || '';
        const email = investor.email || '';
        
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               phoneNumber.includes(searchTerm) ||
               email.toLowerCase().includes(searchTerm.toLowerCase());
    })

    if (isLoading) {
        return (
            <div className="overallleft">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading investors...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="overallleft">
                <div className="topbox">
                    <div className="topboxleft">
                        <p className='topboxlefttitle'>Investors</p>
                        <p className='topboxleftdesc'>Manage and view all investor accounts</p>
                    </div>
                    <div className="topboxright" onClick={handleAddInvestorClick}>
                        <Plus />
                        <p>Add Investor</p>
                    </div>
                </div>
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => setError('')} className="error-close">×</button>
                    </div>
                )}
                {successMessage && (
                    <div className="success-message">
                        <p>{successMessage}</p>
                        <button onClick={() => setSuccessMessage('')} className="success-close">×</button>
                    </div>
                )}
                <div className='searchbarinvestor'>
                    <Search className='searchinputlogo' />
                    <input 
                        type='text' 
                        placeholder='search investor' 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="investorpagefour">
                    <div className="investorpagefourper">
                        <TrendingUp className='investorstatsicon' />
                        <div>
                            <p className='investorpagefourpertitle'>Total Investors</p>
                            <p className='investorpagefourperdesc'>{stats.totalInvestors}</p>
                        </div>
                    </div>
                    <div className="investorpagefourper">
                        <TrendingUp className='investorstatsicon' />
                        <div>
                            <p className='investorpagefourpertitle'>Active Investors</p>
                            <p className='investorpagefourperdesc'>{stats.activeInvestors}</p>
                        </div>
                    </div>
                    <div className="investorpagefourper">
                        <Calendar className='investorstatsicon' />
                        <div>
                            <p className='investorpagefourpertitle'>This Month</p>
                            <p className='investorpagefourperdesc'>{stats.thisMonthInvestors}</p>
                        </div>
                    </div>
                    <div className="investorpagefourper">
                        <TrendingUp className='investorstatsicon' />
                        <div>
                            <p className='investorpagefourpertitle'>Growth Rate</p>
                            <p className='investorpagefourperdesc'>{stats.growthRate}%</p>
                        </div>
                    </div>
                </div>

                <div className='investorsdetailssection'>
                    <div className='investordetailsperrow'>
                        <div className='investorname forbgandbold'>Investor</div>
                        <div className='investorcontact forbgandbold'>Contact</div>
                        <div className='investorjoindate forbgandbold'>Join Date</div>
                        <div className='totalinvested forbgandbold'>Total Invested</div>
                        <div className='totalrevenue forbgandbold'>Total Returns</div>
                        <div className='yearlyplan forbgandbold'>Yearly Plan</div>
                        <div className='investorstatus forbgandbold'>Status</div>
                        <div className='creditamount forbgandbold'>Credit Amount</div>
                        <div className="profileselect forbgandbold">Profile</div>
                        <div className='actionbtn forbgandbold'>Actions</div>
                    </div>
                    {filteredInvestors.length > 0 ? (
                        filteredInvestors.map((investor) => {
                            if (!investor || !investor._id) return null;
                            
                            return (
                                <div key={investor._id} className='investordetailsperrow'>
                                    <div className='investorname'>{investor.name || 'N/A'}</div>
                                    <div className='investorcontact'>{investor.phoneNumber || 'N/A'}</div>
                                    <div className='investorjoindate'>{investor.joinDate ? formatDate(investor.joinDate) : 'N/A'}</div>
                                    <div className='totalinvested'>{formatCurrency(investor.totalMoneyInvested || 0)}</div>
                                    <div className='totalrevenue'>{formatCurrency(investor.totalReturns || 0)}</div>
                                    <div className='yearlyplan'>{investor.yearlyPlan || 'Not Selected'}</div>
                                    <div className={`investorstatus ${investor.status || 'unknown'}`}>{investor.status || 'Unknown'}</div>
                                    <div className='creditamount'>
                                        <input 
                                            type='number' 
                                            placeholder='Enter amount'
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleCreditAmountChange(investor._id, e.target.value)
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="profileselect">
                                        <UserPen onClick={()=>{
                                            setSelectedInvestor(investor)
                                            setOpenStatement(true)
                                        }} />
                                    </div>
                                    <div className='actionbtn' onClick={()=>{handleEditInvestor(investor)}}>
                                        <SquarePen />
                                        <p>Edit</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-investors">
                            <p>No investors found</p>
                        </div>
                    )}
                </div>

                <div className={`addformpopup ${adduserpopup ? 'addformpopupactive' : ''}`}  onClick={handleCloseAddPopup}>
                    <div className="inneraddformppup" onClick={(e) => e.stopPropagation()}>
                        <X className='cutaddform' onClick={handleCloseAddPopup} />
                        <div className='addformpopline'>
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='Enter Investor Name' 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='Enter Contact Number' 
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            />
                        </div>
                        <div className='addformpopline'>
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='Street Address (Optional)' 
                                value={formData.address.street}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    address: {...formData.address, street: e.target.value}
                                })}
                            />
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='City (Optional)' 
                                value={formData.address.city}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    address: {...formData.address, city: e.target.value}
                                })}
                            />
                        </div>
                        <div className='addformpopline'>
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='State (Optional)' 
                                value={formData.address.state}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    address: {...formData.address, state: e.target.value}
                                })}
                            />
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='Pincode (Optional)' 
                                value={formData.address.pincode}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    address: {...formData.address, pincode: e.target.value}
                                })}
                            />
                        </div>

                        <div className='addformpopline'>
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='Bank Account Number (Optional)' 
                                value={formData.bankDetails.accountNumber}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    bankDetails: {...formData.bankDetails, accountNumber: e.target.value}
                                })}
                            />
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='IFSC Code (Optional)' 
                                value={formData.bankDetails.ifscCode}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    bankDetails: {...formData.bankDetails, ifscCode: e.target.value}
                                })}
                            />
                        </div>
                        <div className='addformpopline'>
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='Bank Name (Optional)' 
                                value={formData.bankDetails.bankName}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    bankDetails: {...formData.bankDetails, bankName: e.target.value}
                                })}
                            />
                            <input 
                                className='addforminputper' 
                                type='text' 
                                placeholder='Account Holder Name (Optional)' 
                                value={formData.bankDetails.accountHolderName}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    bankDetails: {...formData.bankDetails, accountHolderName: e.target.value}
                                })}
                            />
                        </div>
                        <div className='addformpopline'>
                            <select 
                                className='addforminputper'
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select 
                                className='addforminputper'
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
                        <div className='addformpopline'>
                            <input 
                                className='addforminputper' 
                                type='number' 
                                placeholder='Initial Investment Amount (optional)' 
                                value={formData.totalMoneyInvested}
                                onChange={(e) => setFormData({...formData, totalMoneyInvested: e.target.value})}
                            />
                            <select 
                                className='addforminputper'
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

                        <p className='investnowbtn' onClick={handleCreateInvestor}>Add Investor</p>
                    </div>
                </div>

                <EditInvestorDetails 
                    edituserpopup={edituserpopup} 
                    setEdituserpopup={setEdituserpopup}
                    formData={formData}
                    setFormData={setFormData}
                    onUpdate={handleUpdateInvestor}
                    onDelete={handleDeleteInvestor}
                    investmentPlans={investmentPlans}
                />
                <Statement openStatement={openStatement} setOpenStatement={setOpenStatement} selectedInvestor={selectedInvestor} />

                {/* Credit Confirmation Popup */}
                <div className={`creditpopup ${creditPopup ? 'creditpopup-active' : ''}`} onClick={() => setCreditPopup(false)}>
                    <div className="creditpopup-inner" onClick={(e) => e.stopPropagation()}>
                        <X className='creditpopup-cross' onClick={() => setCreditPopup(false)} />
                        <h3>Credit Amount to {selectedInvestorForCredit?.name}</h3>
                        <div className='creditpopup-content'>
                            <div className='creditpopup-input-group'>
                                <label>Amount (₹) *</label>
                                <input 
                                    type='number' 
                                    value={creditAmount}
                                    onChange={(e) => setCreditAmount(e.target.value)}
                                    placeholder='Enter amount (required)'
                                />
                            </div>
                            <div className='creditpopup-input-group'>
                                <label>Notes (Optional)</label>
                                <textarea 
                                    value={creditNotes}
                                    onChange={(e) => setCreditNotes(e.target.value)}
                                    placeholder='Enter notes for this credit (optional)'
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className='creditpopup-buttons'>
                            <button className='creditpopup-cancel' onClick={() => setCreditPopup(false)}>
                                Cancel
                            </button>
                            <button className='creditpopup-confirm' onClick={handleCreditSubmit}>
                                Confirm Credit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InvestorsSection
