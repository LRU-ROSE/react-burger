import { Logo } from '@ya.praktikum/react-developer-burger-ui-components';
import AppHeaderLink from '../AppHeaderLink';
import cs from './styles.module.css';

const AppHeader = () => {
  return (
    <header className={cs.header}>
      <nav className={cs.navigation}>
        <ul className={cs.menu}>
          <li>
            <AppHeaderLink iconName='burger' text='Конструктор' href='#' active />
          </li>
          <li>
            <AppHeaderLink iconName='list' text='Лента заказов' href='#' />
          </li>
        </ul>
        <a href='/' className={cs.logo}>
          <Logo />
        </a>
        <AppHeaderLink iconName='profile' text='Личный кабинет' href='#' className={cs.login} />
      </nav>
    </header>
  );
};

export default AppHeader;
