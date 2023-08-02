import { Logo } from '@ya.praktikum/react-developer-burger-ui-components';
import AppHeaderLink from '../AppHeaderLink';
import cs from './styles.module.css';
import { Link } from 'react-router-dom';

const AppHeader = () => {
  return (
    <header className={cs.header}>
      <nav className={cs.navigation}>
        <ul className={cs.menu}>
          <li>
            <AppHeaderLink iconName='burger' text='Конструктор' href='/' pathExact />
          </li>
          <li>
            <AppHeaderLink iconName='list' text='Лента заказов' href='/feed' />
          </li>
        </ul>
        <Link to='/' className={cs.logo}>
          <Logo />
        </Link>
        <AppHeaderLink iconName='profile' text='Личный кабинет' href='/profile' className={cs.login} />
      </nav>
    </header>
  );
};

export default AppHeader;
