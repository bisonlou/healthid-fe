import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Footer from './Templates/Footer';
import LowerNavbar from '../shared/LowerNavbar';
import Dashboard from '../shared/Dashboard/Dashboard';
import withAuth from '../withAuth';
import DataTable from './Templates/Table/DataTable';
import DataTableLoader from '../dataTable/dataTableLoader';
import '../../assets/styles/stock/stock_products.scss';
import GET_ALL_SUPPLIERS from '../../queries/getSuppliers';

export class SuppliersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  createColumns = columns => columns.map(title => ({
    id: title.replace(/ +/g, ''),
    label: title.toUpperCase()
  }));

  render() {
    const { session } = this.props;
    const columnHeaders = ['id', 'name', 'tier', ' rating', 'notes'];

    return (
      <div>
        <Dashboard isActive="grid3" session={session} />
        <LowerNavbar />
        <Query query={GET_ALL_SUPPLIERS}>
          {({ loading, error, data }) => {
            if (loading) {
              return (
                <DataTableLoader />
              );
            }
            if (error) return `Error! ${error.message}`;

            const suppliers = data.allSuppliers.map((supplier) => {
              if (supplier) {
                return {
                  id: supplier.id,
                  name: supplier.name,
                  tier: supplier.tier.name,
                  rating: supplier.rating,
                  notes: supplier.suppliernoteSet
                };
              }

              return false;
            });

            const isAuthorised = session.me.role.name.match(/^(Master Admin|Operations Admin)$/);

            return (
              <div name="stock_products">
                <DataTable
                  title="Supplier(s)"
                  isAdmin={Boolean(isAuthorised)}
                  columns={this.createColumns(columnHeaders)}
                  data={suppliers}
                  onRowClick={() => { }}
                />
              </div>
            );
          }}
        </Query>
        <Footer />
      </div>
    );
  }
}

SuppliersPage.propTypes = {
  session: PropTypes.objectOf(PropTypes.object)
};

SuppliersPage.defaultProps = {
  session: { me: {} }
};

export default withAuth(withRouter(SuppliersPage));
