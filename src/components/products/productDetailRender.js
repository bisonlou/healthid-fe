import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Paper, TextField, Grid, Button, TableCell
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { productDetailStyles } from '../../assets/styles/products/productDetailStyles';
import Dashboard from '../shared/Dashboard/Dashboard';
import ProductHeader from './Templates/Header';
import Footer from '../shared/Footer';
import BatchInformation from './Templates/BatchInformation';
import Description from './Templates/Description';
import ProductInformation from './Templates/ProductInformation';
import StockDetails from './Templates/StockDetails';

const productsLink = props => <Link to="/products" {...props} />;

const moneyFormat = num => `${num.toFixed(2)}`;

const subtotal = items => items.map(
  ({ price }) => price
).reduce((sum, i) => sum + i, 0);

const quantityTotal = pricedArray => pricedArray.map(
  ({ quantity }) => quantity
).reduce((sum, i) => sum + i, 0);

const priceColumn = (quantity, unitCost) => quantity * unitCost;

const createRow = ({
  id, dateReceived, supplier, expiryDate, quantity, unitCost
}) => {
  const price = priceColumn(quantity, unitCost);
  return {
    id, dateReceived, supplier, expiryDate, quantity, unitCost, price
  };
};

const priceTotal = pricedArray => subtotal(pricedArray);

const AddPriceField = batchArray => batchArray.map(batch => createRow(batch));

export const ProductDetailRender = (props) => {
  const {
    product: {
      id,
      batchInfo,
      outlet,
      productName,
      salesPrice,
      skuNumber,
      description,
      manufacturer,
      productCategory,
      measurementUnit,
      image,
      brand,
      vatStatus,
      productQuantity,
      reorderMax,
      reorderPoint,
      nearestExpiryDate,
      preferredSupplier,
      loyaltyWeight,
      backupSupplier,
      tags,
    },
    classes,
    session,
  } = props;
  const withPriceField = AddPriceField(batchInfo);
  let currency = '₦';
  if (outlet.outletpreference) {
    currency = outlet.outletpreference.outletCurrency.symbol;
  }

  const renderTextField = (style, name, label, value) => (
    <TextField
      className={style}
      id={name}
      name={name}
      label={label}
      value={value}
      fullWidth
      InputProps={{ disableUnderline: true, readOnly: true }}
    />
  );
  const renderTableCell = (align, style, name) => (
    <TableCell
      align={align || ''}
      style={style}
    >
      {name}
    </TableCell>
  );

  return (
    <React.Fragment>
      <Dashboard isActive="grid3" session={session} />
      <ProductHeader classes={classes} previousPage="/products/approved" productName={productName} />

      <Paper className={classes.paper}>
        <Description
          classes={classes}
          renderTextField={renderTextField}
          productCategory={productCategory}
          description={description}
          tags={tags}
          image={image}
        />

        <ProductInformation
          classes={classes}
          renderTextField={renderTextField}
          measurementUnit={measurementUnit}
          loyaltyWeight={loyaltyWeight}
          preferredSupplier={preferredSupplier}
          backupSupplier={backupSupplier}
          id={id}
          skuNumber={skuNumber}
          vatStatus={vatStatus}
          manufacturer={manufacturer}
          brand={brand}
        />

        <StockDetails
          classes={classes}
          renderTextField={renderTextField}
          salesPrice={salesPrice}
          reorderMax={reorderMax}
          reorderPoint={reorderPoint}
          nearestExpiryDate={nearestExpiryDate}
          productQuantity={productQuantity}
        />

        <BatchInformation
          classes={classes}
          renderTableCell={renderTableCell}
          withPriceField={withPriceField}
          skuNumber={skuNumber}
          manufacturer={manufacturer}
          currency={currency}
          moneyFormat={moneyFormat}
          quantityTotal={quantityTotal}
          priceTotal={priceTotal}
        />

        <Grid container spacing={24} className={classes.buttonMainGrid}>
          <Grid item xs={12}>
            <div className={classes.buttonsDiv}>
              <Button
                component={productsLink}
                variant="contained"
                color="primary"
                className={classes.backButton}
              >
                back
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
      <Footer />
    </React.Fragment>
  );
};

ProductDetailRender.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired,
  classes: PropTypes.instanceOf(Object).isRequired,
  session: PropTypes.objectOf(PropTypes.object)
};

ProductDetailRender.defaultProps = {
  session: {}
};

export default withStyles(productDetailStyles)(ProductDetailRender);
