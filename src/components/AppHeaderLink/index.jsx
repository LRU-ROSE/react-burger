import { ProfileIcon, ListIcon, BurgerIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { cx } from '../../utils';

import cs from './styles.module.css';
import { Link, useLocation } from 'react-router-dom';

const AppHeaderLink = ({ text, href, pathExact = false, iconName, className = null }) => {
  const location = useLocation();
  const active = pathExact ? location.pathname === href : location.pathname.startsWith(href);
  const iconType = active ? 'primary' : 'secondary';
  let iconEl;
  switch (iconName) {
    case 'profile':
      iconEl = <ProfileIcon type={iconType} />;
      break;
    case 'list':
      iconEl = <ListIcon type={iconType} />;
      break;
    case 'burger':
      iconEl = <BurgerIcon type={iconType} />;
      break;

    default:
      iconEl = null;
      break;
  }
  return (
    <Link to={href} className={cx(cs.link, className)}>
      {iconEl}
      <p className={`text text_type_main-default${ active ? '' : ' text_color_inactive'}`}>
        {text}
      </p>
    </Link>
  );
};

AppHeaderLink.propTypes = {
  iconName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string, // Необязателен
  pathExact: PropTypes.bool, // Необязателен
};

export default AppHeaderLink;
