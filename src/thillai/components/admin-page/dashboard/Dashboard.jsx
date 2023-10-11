import React, { Component } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { connect } from 'react-redux';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 'today',
            filteredOrders: []
        }
    }

    getOrderData = async () => {
        
        this.filterOrders("today")
    }



    componentDidMount() {
        this.getOrderData()
    }

    filterOrders(k) {
        this.setState({ key: k })

        if (k === "today") {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            const todaysMiliseconds = new Date(`${yyyy}-${mm}-${dd}`).getTime() - 60 * 60 * 1000 * 3
            let todaysOrders = this.props.orderList.filter(o => o.data.timeStamp >= todaysMiliseconds)
            todaysOrders.sort((a, b) => a.data.timeStamp - b.data.timeStamp)
            this.setState({
                filteredOrders: [...todaysOrders]
            })
        }
        else {
            this.setState({
                filteredOrders: structuredClone(this.props.orderList).sort((a, b) => a.data.timeStamp - b.data.timeStamp)
            })
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col px-1">
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={this.state.key}
                            onSelect={(k) => this.filterOrders(k)}
                            className="mb-2"
                        >
                            <Tab eventKey="today" title="Today">

                            </Tab>
                            <Tab eventKey="all" title="All">

                            </Tab>
                        </Tabs>
                    </div>
                </div>

            </div >
        )
    }
}

const mapStateToProps = (state) => ({
    orderList: state.adminDashboard.orders,
    productList: state.product.list
});

export default connect(mapStateToProps)(Dashboard);