import { useState } from 'react'
import {
  APP_INFO,
  calculateBudgetSummary,
  formatCurrency,
  getAppGreeting,
  type ExpenseItem,
} from '@budgetshare/shared'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  const sampleExpenses: ExpenseItem[] = [
    { id: '1', category: 'Housing', amount: 1200 },
    { id: '2', category: 'Groceries', amount: 450 },
    { id: '3', category: 'Utilities', amount: 180 },
    { id: '4', category: 'Entertainment', amount: 150 },
  ]

  const greeting = getAppGreeting('React Web')
  const summary = calculateBudgetSummary(sampleExpenses, selectedCurrency)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>{APP_INFO.name} Web</h1>
          <p>{greeting}</p>
        </div>

        {/* Demo Card utilizing common package @budgetshare/shared */}
        <div
          style={{
            margin: '20px auto',
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '500px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#646cff' }}>
              📦 Shared Package Demo (<code style={{ fontSize: '0.85em' }}>@budgetshare/shared</code>)
            </h3>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #444',
              }}
            >
              {APP_INFO.supportedCurrencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.8 }}>
            Tagline: <em>{APP_INFO.tagline}</em>
          </p>

          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />

          <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: '8px 0' }}>
            Total Budget:{' '}
            <span style={{ color: '#4caf50' }}>{formatCurrency(summary.total, selectedCurrency)}</span>
          </p>
          <p style={{ fontSize: '0.9rem', margin: '4px 0' }}>
            Top Expense Category: <strong>{summary.topCategory}</strong>
          </p>

          <div style={{ marginTop: '12px' }}>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '0.95rem' }}>Category Breakdown:</h4>
            {summary.categories.map((cat) => (
              <div
                key={cat.category}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  padding: '4px 0',
                  borderBottom: '1px dotted rgba(255,255,255,0.1)',
                }}
              >
                <span>{cat.category} ({cat.percentage}%)</span>
                <span>{cat.formattedAmount}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
