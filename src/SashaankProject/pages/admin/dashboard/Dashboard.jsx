//Admin Dashboard
import React, { useContext } from 'react'
import MyShankContext from '../../../../SuryaProject/context/data/MyShankContext';
import Layout from '../../../components/layout/Layout';
import DashboardTab from './DashboardTab';

function Dashboard() {
    const context = useContext(MyShankContext)
    const { mode} = context
  return (
    <Layout>
        <section className="text-gray-600 body-font mt-10 mb-10">
            <DashboardTab/>
        </section>
    </Layout>
  )
}

export default Dashboard