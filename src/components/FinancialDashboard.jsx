import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const FinancialDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startYear: '',
    endYear: '',
    minRevenue: '',
    maxRevenue: '',
    minNetIncome: '',
    maxNetIncome: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${import.meta.env.VITE_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getChartData = (data) => {
    return data.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      revenue: item.revenue / 1000000000,
      operatingMargin: ((item.operatingIncome / item.revenue) * 100).toFixed(2),
      netIncome: item.netIncome / 1000000000,
    })).reverse();
  };

  const filteredAndSortedData = React.useMemo(() => {
    let filtered = [...data];

    if (filters.startYear) {
      filtered = filtered.filter(item => 
        new Date(item.date).getFullYear() >= parseInt(filters.startYear)
      );
    }
    if (filters.endYear) {
      filtered = filtered.filter(item => 
        new Date(item.date).getFullYear() <= parseInt(filters.endYear)
      );
    }
    if (filters.minRevenue) {
      filtered = filtered.filter(item => 
        item.revenue >= parseFloat(filters.minRevenue)
      );
    }
    if (filters.maxRevenue) {
      filtered = filtered.filter(item => 
        item.revenue <= parseFloat(filters.maxRevenue)
      );
    }
    if (filters.minNetIncome) {
      filtered = filtered.filter(item => 
        item.netIncome >= parseFloat(filters.minNetIncome)
      );
    }
    if (filters.maxNetIncome) {
      filtered = filtered.filter(item => 
        item.netIncome <= parseFloat(filters.maxNetIncome)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.key) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'revenue':
          comparison = a.revenue - b.revenue;
          break;
        case 'netIncome':
          comparison = a.netIncome - b.netIncome;
          break;
        default:
          comparison = 0;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [data, filters, sortConfig]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a] text-red-500">
      <div>Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Financial Analysis Dashboard</h1>
          <p className="text-gray-400">Apple Inc. (AAPL) - Financial Performance Analysis</p>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-[#2a2a2a] border-[#404040]">
            <CardHeader>
              <CardTitle className="text-white">Revenue vs Operating Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData(filteredAndSortedData)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="date" stroke="#a0a0a0" />
                    <YAxis stroke="#a0a0a0" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#2a2a2a', border: 'none' }}
                      labelStyle={{ color: '#a0a0a0' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue (Billions)" />
                    <Line type="monotone" dataKey="operatingMargin" stroke="#ef4444" name="Operating Margin %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-[#404040]">
            <CardHeader>
              <CardTitle className="text-white">Net Income Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData(filteredAndSortedData)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="date" stroke="#a0a0a0" />
                    <YAxis stroke="#a0a0a0" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#2a2a2a', border: 'none' }}
                      labelStyle={{ color: '#a0a0a0' }}
                    />
                    <Legend />
                    <Bar dataKey="netIncome" fill="#10b981" name="Net Income (Billions)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-[#2a2a2a] border-[#404040]">
          <CardHeader className="border-b border-[#404040]">
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Year Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    name="startYear"
                    placeholder="Start Year"
                    value={filters.startYear}
                    onChange={handleFilterChange}
                    className="bg-[#1a1a1a] border-[#404040] text-white"
                  />
                  <Input
                    type="number"
                    name="endYear"
                    placeholder="End Year"
                    value={filters.endYear}
                    onChange={handleFilterChange}
                    className="bg-[#1a1a1a] border-[#404040] text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Revenue Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    name="minRevenue"
                    placeholder="Min Revenue"
                    value={filters.minRevenue}
                    onChange={handleFilterChange}
                    className="bg-[#1a1a1a] border-[#404040] text-white"
                  />
                  <Input
                    type="number"
                    name="maxRevenue"
                    placeholder="Max Revenue"
                    value={filters.maxRevenue}
                    onChange={handleFilterChange}
                    className="bg-[#1a1a1a] border-[#404040] text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Net Income Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    name="minNetIncome"
                    placeholder="Min Net Income"
                    value={filters.minNetIncome}
                    onChange={handleFilterChange}
                    className="bg-[#1a1a1a] border-[#404040] text-white"
                  />
                  <Input
                    type="number"
                    name="maxNetIncome"
                    placeholder="Max Net Income"
                    value={filters.maxNetIncome}
                    onChange={handleFilterChange}
                    className="bg-[#1a1a1a] border-[#404040] text-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="bg-[#2a2a2a] border-[#404040]">
          <CardHeader className="border-b border-[#404040]">
            <CardTitle className="text-white">Financial Statements</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#404040]">
                    <TableHead className="text-gray-400">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white"
                      >
                        Date
                        {sortConfig.key === 'date' && (
                          sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-400">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('revenue')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white"
                      >
                        Revenue
                        {sortConfig.key === 'revenue' && (
                          sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-400">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('netIncome')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white"
                      >
                        Net Income
                        {sortConfig.key === 'netIncome' && (
                          sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-400">Gross Profit</TableHead>
                    <TableHead className="text-gray-400">EPS</TableHead>
                    <TableHead className="text-gray-400">Operating Income</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedData.map((item, index) => (
                    <TableRow key={index} className="border-[#404040] hover:bg-[#353535]">
                      <TableCell className="text-gray-300">{formatDate(item.date)}</TableCell>
                      <TableCell className="text-gray-300">{formatCurrency(item.revenue)}</TableCell>
                      <TableCell className="text-gray-300">{formatCurrency(item.netIncome)}</TableCell>
                      <TableCell className="text-gray-300">{formatCurrency(item.grossProfit)}</TableCell>
                      <TableCell className="text-gray-300">${item.eps.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-300">{formatCurrency(item.operatingIncome)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
