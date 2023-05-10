//components
import Status from './components/status.js';
import Contracts from './components/contracts.js';
import Transactions from './components/transactions.js';

export default function App() {
  return (

    <div>

      {Status()}

      {Contracts()}

      {Transactions()}

    </div>

  )
}