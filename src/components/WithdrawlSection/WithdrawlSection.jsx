import React, {useState, useEffect} from 'react'
import './WithdrawlSection.css'
import '../InvestorsSection/InvestorsSection.css'
import { Plus, Search, BanknoteArrowDown, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const WithdrawlSection = () => {
    const [withdrawpopup, setWithdrawpopup] = useState(false)
    const [investors, setInvestors] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [selectedInvestor, setSelectedInvestor] = useState(null)
    const [withdrawalAmount, setWithdrawalAmount] = useState('')
    const [withdrawalNotes, setWithdrawalNotes] = useState('')
    const { token } = useAuth()

    useEffect(() => {
        console.log('WithdrawlSection useEffect triggered, token:', !!token)
        fetchInvestors()
    }, [token])

    const fetchInvestors = async () => {
        console.log('fetchInvestors called, token exists:', !!token)
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

    const handleWithdrawalClick = (investor, amount) => {
        if (!amount || amount <= 0) {
            setError('Please enter a valid withdrawal amount greater than 0')
            return
        }
        setSelectedInvestor(investor)
        setWithdrawalAmount(amount.toString())
        setWithdrawalNotes('')
        setWithdrawpopup(true)
        setError('') // Clear any previous errors
    }

    const handleWithdrawalSubmit = async () => {
        if (!token || !selectedInvestor || !withdrawalAmount) {
            setError('Please enter the amount to withdraw')
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investors/${selectedInvestor._id}/debit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: parseInt(withdrawalAmount),
                    notes: withdrawalNotes || 'Withdrawal transaction'
                })
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Withdrawal successful:', data)
                setSuccessMessage(data.message || 'Withdrawal successful!')
                setError('') // Clear any previous errors
                setWithdrawpopup(false)
                setSelectedInvestor(null)
                setWithdrawalAmount('')
                setWithdrawalNotes('')
                fetchInvestors() // Refresh the investors list
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('')
                }, 3000)
            } else {
                const errorData = await response.json()
                console.error('Failed to process withdrawal:', errorData)
                setError(errorData.message || 'Failed to process withdrawal. Please try again.')
            }
        } catch (error) {
            console.error('Error processing withdrawal:', error)
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
                        <p className='topboxlefttitle'>Withdrawal Requests</p>
                        <p className='topboxleftdesc'>Manage investor withdrawal requests and payouts</p>
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

                <div className='investorsdetailssection'>
                    <div className='investordetailsperrow'>
                        <div className='investorname forbgandbold'>Investor</div>
                        <div className='investorcontact forbgandbold'>Contact</div>
                        <div className='investorjoindate forbgandbold'>Join Date</div>
                        <div className='totalinvested forbgandbold'>Total Invested</div>
                        <div className='totalrevenue forbgandbold'>Total Returns</div>
                        <div className='withdrawlsecinput forbgandbold'>Amount</div>
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
                                    <div className='withdrawlsecinput'>
                                        <input 
                                            className='withamountpg' 
                                            type='number' 
                                            placeholder='Amount' 
                                            data-investor-id={investor._id}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleWithdrawalClick(investor, e.target.value)
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='actionbtn'>
                                        <p 
                                            onClick={() => {
                                                const amountInput = document.querySelector(`input[data-investor-id="${investor._id}"]`)
                                                handleWithdrawalClick(investor, amountInput?.value)
                                            }} 
                                            className='formorestyle'
                                        >
                                            Withdrawal
                                        </p>
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

                {/* Withdrawal Confirmation Popup */}
                <div className={`withdrawalpopup ${withdrawpopup ? 'withdrawalpopup-active' : ''}`} onClick={() => setWithdrawpopup(false)}>
                    <div className="withdrawalpopup-inner" onClick={(e) => e.stopPropagation()}>
                        <X className='withdrawalpopup-cross' onClick={() => setWithdrawpopup(false)} />
                        <h3>Withdrawal from {selectedInvestor?.name}</h3>
                        <div className='withdrawalpopup-content'>
                                                               <div className='withdrawalpopup-input-group'>
                                       <label>Amount (₹) *</label>
                                       <input 
                                           type='number' 
                                           value={withdrawalAmount}
                                           onChange={(e) => setWithdrawalAmount(e.target.value)}
                                           placeholder='Enter amount (required)'
                                       />
                                   </div>
                                                               <div className='withdrawalpopup-input-group'>
                                       <label>Notes (Optional)</label>
                                       <textarea 
                                           value={withdrawalNotes}
                                           onChange={(e) => setWithdrawalNotes(e.target.value)}
                                           placeholder='Enter notes for this withdrawal (optional)'
                                           rows={3}
                                       />
                                   </div>
                        </div>
                        <div className='withdrawalpopup-buttons'>
                            <button className='withdrawalpopup-cancel' onClick={() => setWithdrawpopup(false)}>
                                Cancel
                            </button>
                            <button className='withdrawalpopup-confirm' onClick={handleWithdrawalSubmit}>
                                Confirm Withdrawal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WithdrawlSection
