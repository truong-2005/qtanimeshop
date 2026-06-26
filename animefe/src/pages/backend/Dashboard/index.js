import React, { useState, useEffect } from 'react';
import Title from '../../../components/common/Title';
import DashboardCard from '../../../components/backend/DashboardCard';
import dashboardApi from '../../../api/dashboardApi';
import { formatCurrency } from '../../../utils';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('Month');
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStatistics();
        if (res) {
          setStatsData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // SVG Line Chart coordinates and paths
  const chartWidth = 1000;
  const chartHeight = 220;

  // Path coordinates for Line 1 (Traffic line)
  const line1Path = "M 50 180 C 150 150, 250 130, 350 160 C 450 190, 550 80, 650 90 C 750 100, 850 170, 950 110";
  const line1Area = `${line1Path} L 950 ${chartHeight} L 50 ${chartHeight} Z`;

  // Path coordinates for Line 2 (Secondary comparison line)
  const line2Path = "M 50 140 C 150 110, 250 160, 350 120 C 450 80, 550 150, 650 160 C 750 170, 850 110, 950 80";

  const stats = [
    { label: 'Visits', value: '29.703 Users', percentage: '40%', color: 'bg-emerald-500' },
    { label: 'Unique', value: '24.093 Users', percentage: '20%', color: 'bg-cyan-500' },
    { label: 'Pageviews', value: '78.706 Views', percentage: '60%', color: 'bg-indigo-500' },
    { label: 'New Users', value: '22.123 Users', percentage: '80%', color: 'bg-amber-500' },
    { label: 'Bounce Rate', value: '40.15%', percentage: '40%', color: 'bg-rose-500' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <Title subtitle="Thông số thống kê hoạt động kinh doanh của Anime Store">
          Tổng quan Dashboard
        </Title>
      </div>

      {/* 4 Cards Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Users"
          value={statsData?.totalUsers || statsData?.users || "26K"}
          percentage={statsData?.usersPercentage || "-12.4%"}
          isIncrease={statsData?.usersIncrease !== undefined ? statsData.usersIncrease : false}
          variant="purple"
          sparklineData={statsData?.usersSparkline || [12, 14, 11, 9, 15, 10, 8]}
        />
        <DashboardCard
          title="Income"
          value={statsData?.totalIncome || statsData?.income || statsData?.revenue ? (statsData.totalIncome || statsData.income || formatCurrency(statsData.revenue)) : "$9,800"}
          percentage={statsData?.incomePercentage || "+40.9%"}
          isIncrease={statsData?.incomeIncrease !== undefined ? statsData.incomeIncrease : true}
          variant="blue"
          sparklineData={statsData?.incomeSparkline || [10, 12, 15, 13, 17, 19, 21]}
        />
        <DashboardCard
          title="Conversion Rate"
          value={statsData?.conversionRate ? statsData.conversionRate + '%' : "2.49%"}
          percentage={statsData?.conversionPercentage || "+84.7%"}
          isIncrease={statsData?.conversionIncrease !== undefined ? statsData.conversionIncrease : true}
          variant="orange"
          sparklineData={statsData?.conversionSparkline || [8, 10, 9, 12, 14, 15, 18]}
        />
        <DashboardCard
          title="Sessions"
          value={statsData?.sessions || statsData?.sessionsCount || "44K"}
          percentage={statsData?.sessionsPercentage || "-23.6%"}
          isIncrease={statsData?.sessionsIncrease !== undefined ? statsData.sessionsIncrease : false}
          variant="red"
          sparklineData={statsData?.sessionsSparkline || [22, 20, 18, 15, 16, 14, 12]}
        />
      </div>

      {/* Main Traffic Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Traffic</h3>
            <p className="text-xs text-slate-500">January - July 2026</p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Timeframe Selectors */}
            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-1">
              {['Day', 'Month', 'Year'].map((item) => (
                <button
                  key={item}
                  onClick={() => setTimeframe(item)}
                  className={`
                    px-3 py-1.5 text-xs font-semibold rounded-md transition-all
                    ${timeframe === item
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Download Button */}
            <button className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Large SVG Area Chart */}
        <div className="relative w-full h-[300px] overflow-hidden select-none">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1="0"
                y1={ratio * chartHeight}
                x2={chartWidth}
                y2={ratio * chartHeight}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Line 1 Shaded Area */}
            <path d={line1Area} fill="url(#chartAreaGradient)" />

            {/* Line 1 (Traffic Line) */}
            <path
              d={line1Path}
              fill="none"
              stroke="#6366F1"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Line 2 (Comparison Line) */}
            <path
              d={line2Path}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 2"
              className="opacity-70"
            />

            {/* Data Points Highlights */}
            <circle cx="650" cy="90" r="5" fill="#6366F1" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="650" cy="160" r="4" fill="#06B6D4" stroke="#0F172A" strokeWidth="2" />

            {/* Month labels at bottom */}
            {['January', 'February', 'March', 'April', 'May', 'June', 'July'].map((month, idx) => {
              const xCoord = 50 + idx * 150;
              return (
                <text
                  key={month}
                  x={xCoord}
                  y={chartHeight + 25}
                  textAnchor="middle"
                  fill="#64748B"
                  className="text-[11px] font-medium tracking-wide"
                >
                  {month}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Bottom statistics columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-t border-slate-800 pt-6 mt-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-sm font-bold text-slate-200">
                {stat.value}
              </span>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${stat.color}`}
                  style={{ width: stat.percentage }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Traffic Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Facebook */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="bg-[#3b5998] py-5 flex items-center justify-center text-white">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
            </svg>
          </div>
          <div className="flex-1 grid grid-cols-2 divide-x divide-slate-800 text-center py-4 bg-slate-950/40">
            <div>
              <p className="text-lg font-extrabold text-slate-200">35k</p>
              <p className="text-xxs font-semibold text-slate-500 uppercase tracking-wider">friends</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-200">128</p>
              <p className="text-xxs font-semibold text-slate-500 uppercase tracking-wider">feeds</p>
            </div>
          </div>
        </div>

        {/* Twitter */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="bg-[#1da1f2] py-5 flex items-center justify-center text-white">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </div>
          <div className="flex-1 grid grid-cols-2 divide-x divide-slate-800 text-center py-4 bg-slate-950/40">
            <div>
              <p className="text-lg font-extrabold text-slate-200">97k</p>
              <p className="text-xxs font-semibold text-slate-500 uppercase tracking-wider">followers</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-200">1.9k</p>
              <p className="text-xxs font-semibold text-slate-500 uppercase tracking-wider">tweets</p>
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="bg-[#0077b5] py-5 flex items-center justify-center text-white">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </div>
          <div className="flex-1 grid grid-cols-2 divide-x divide-slate-800 text-center py-4 bg-slate-950/40">
            <div>
              <p className="text-lg font-extrabold text-slate-200">500+</p>
              <p className="text-xxs font-semibold text-slate-500 uppercase tracking-wider">contacts</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-200">292</p>
              <p className="text-xxs font-semibold text-slate-500 uppercase tracking-wider">feeds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Dashboard };
export default Dashboard;
