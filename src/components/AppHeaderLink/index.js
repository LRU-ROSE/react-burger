import { ProfileIcon, ListIcon, BurgerIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { combineClasses } from '../../utils';

import cs from './styles.module.css';

const AppHeaderLink = ({ text, href, iconName, active = false, className = null }) => {
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
    <a href={href} className={combineClasses(cs.link, className)}>
      {iconEl}
      <p className={`text text_type_main-default${ active ? '' : ' text_color_inactive'}`}>
        {text}
      </p>
    </a>
  );
};

AppHeaderLink.propTypes = {
  iconName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string, // Необязателен
  active: PropTypes.bool, // Необязателен (если атрибут отсутствует, значит он равен false)
};

export default AppHeaderLink;
