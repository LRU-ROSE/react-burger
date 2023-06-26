import PropTypes from 'prop-types';

export const OrderStatus = PropTypes.oneOf(['done', 'pending', 'created']);

export const OrderType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  status: OrderStatus.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
});
