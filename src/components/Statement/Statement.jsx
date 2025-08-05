import React, { useState, useEffect } from 'react'
import './Statement.css'
import { X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Statement = ({ openStatement, setOpenStatement, selectedInvestor }) => {
    const [transactions, setTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const { token } = useAuth()

    useEffect(() => {
        if (openStatement && selectedInvestor) {
            fetchTransactions()
        }
    }, [openStatement, selectedInvestor])

    const fetchTransactions = async () => {
        if (!token || !selectedInvestor) return

        try {
            setIsLoading(true)
            setError('')
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investors/${selectedInvestor._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                setTransactions(data.data.transactions || [])
            } else {
                const errorData = await response.json()
                console.error('Failed to fetch transactions:', errorData)
                setError('Failed to load transactions. Please try again.')
            }
        } catch (error) {
            console.error('Error fetching transactions:', error)
            setError('Network error. Please check your connection and try again.')
        } finally {
            setIsLoading(false)
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

    const calculateTotals = () => {
        const creditTotal = transactions
            .filter(t => t.type === 'credit')
            .reduce((sum, t) => sum + t.amount, 0)
        
        const debitTotal = transactions
            .filter(t => t.type === 'debit')
            .reduce((sum, t) => sum + t.amount, 0)
        
        return { creditTotal, debitTotal }
    }

    const { creditTotal, debitTotal } = calculateTotals()
    return (
        <>
            <div className={`statement ${openStatement ? 'statement-active' : ''}`} onClick={() => { setOpenStatement(false) }}>
                <div className="statementinner" onClick={(e) => { e.stopPropagation() }}>
                    <X className='statementcuticon' onClick={() => { setOpenStatement(false) }} />
                    
                    {selectedInvestor && (
                        <div className='investor-info'>
                            <h3>{selectedInvestor.name} - Transaction Statement</h3>
                            <p>Contact: {selectedInvestor.phoneNumber}</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                            <button onClick={() => setError('')} className="error-close">×</button>
                        </div>
                    )}

                    <div className='profilestatementbox'>
                        <div className='profilestatementheader'>
                            <div className='profilestatementheadernavs forstatementbold'>Transaction Type</div>
                            <div className='profilestatementheadernavs forstatementbold'>Date</div>
                            <div className='profilestatementheadernavs forstatementbold'>Notes</div>
                            <div className='profilestatementheadernavs forstatementbold'>CR Amount</div>
                            <div className='profilestatementheadernavs forstatementbold'>DR Amount</div>
                        </div>
                        
                        {isLoading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading transactions...</p>
                            </div>
                        ) : transactions.length > 0 ? (
                            transactions.map((transaction, index) => {
                                if (!transaction) return null;
                                
                                return (
                                    <div key={transaction._id || index} className='profilestatementheader'>
                                        <div className='profilestatementheadernavs'>
                                            <span className={`transaction-type ${transaction.type || 'unknown'}`}>
                                                {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                                            </span>
                                        </div>
                                        <div className='profilestatementheadernavs'>{formatDate(transaction.date)}</div>
                                        <div className='profilestatementheadernavs'>{transaction.notes || 'N/A'}</div>
                                        <div className='profilestatementheadernavs'>
                                            {transaction.type === 'credit' ? formatCurrency(transaction.amount) : ''}
                                        </div>
                                        <div className='profilestatementheadernavs'>
                                            {transaction.type === 'debit' ? formatCurrency(transaction.amount) : ''}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-transactions">
                                <p>No transactions found for this investor</p>
                            </div>
                        )}
                    </div>
                    
                    {transactions.length > 0 && (
                        <div className='bottomcalc'>
                            <div className='forcalcbox'>
                                <p className='totalwrittentext'>Total Credits</p>
                                <p className='totaladdedamount credit-total'>{formatCurrency(creditTotal)}</p>
                            </div>
                            <div className='forcalcbox'>
                                <p className='totalwrittentext'>Total Debits</p>
                                <p className='totaladdedamount debit-total'>{formatCurrency(debitTotal)}</p>
                            </div>
                            <div className='forcalcbox'>
                                <p className='totalwrittentext'>Net Balance</p>
                                <p className={`totaladdedamount ${creditTotal - debitTotal >= 0 ? 'positive' : 'negative'}`}>
                                    {formatCurrency(creditTotal - debitTotal)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Statement

