import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between py-6 px-8 bg-white rounded-xl shadow mb-10">
          <h1 className="text-2xl font-bold text-blue-700 tracking-wide">台鐵時刻表</h1>
          <nav className="flex gap-8 text-blue-700 font-semibold">
            <Link
              to="/"
              className="hover:text-blue-900 transition-colors px-2 py-1 rounded hover:bg-blue-100"
            >
              首頁
            </Link>
            <Link
              to="/search"
              className="hover:text-blue-900 transition-colors px-2 py-1 rounded hover:bg-blue-100"
            >
              查詢班表
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-blue-400 py-6 text-sm">
          © 2025 台鐵時刻表 | 藍色簡約風
        </footer>
      </div>
    </Router>
  );
}

export default App;
