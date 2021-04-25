import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../../store/router/actions';

import {
    Button,
    ContentCard,
    Div,
    Group,
    HorizontalCell,
    HorizontalScroll,
    Panel,
    PanelHeader,
    Snackbar,
    Text,
    Title
} from "@vkontakte/vkui";

import Icon16ErrorCircleFill from '@vkontakte/icons/dist/16/error_circle_fill';
import Icon20CheckCircleFillGreen from '@vkontakte/icons/dist/20/check_circle_fill_green';

import vk_logo from './../../../images/vk_logo.svg';
import background from './../../../images/background.png';

var items = [
    {title: "ВКонтакте", image: 'https://sun9-56.userapi.com/impg/v_0qkyGx9JHV_2WdQp6JpadFVuvYONAya0lYrA/hEcxRdN7wHA.jpg?size=1024x1024&quality=96&sign=860ff6123c3913d1928ccdafd4d8fc43&type=album', url: "https://vk.com/vk", type: "Организатор", description: "«ВКонта́кте» — российская социальная сеть со штаб-квартирой в Санкт-Петербурге."},
    {title: "РУБИКОН", image: 'https://sun9-56.userapi.com/impg/Wgq71mxH1vC35fFspwNjq3iltbBV1sGmV8R11A/3KoJw44-NDs.jpg?size=1000x1000&quality=96&sign=02f38dd6894924e24d095e81d2ddd965&type=album', url: "https://vk.com/rubiconepro", type: "Партнёр", description: "Программирование, робототехника, создание компьютерных игр, разработка сайтов, фото-, видеомонтаж, анимация, блоггинг."},
    {title: "SmartBear", image: 'https://smartbear.ru/images/logo.png', url: "https://smartbear.ru/", type: "Партнёр", description: "Мы создаем ПО для программистов и тестировщиков, которое помогает сделать так, чтобы их программы работали быстро и без ошибок :-)"},
    {title: "Senla", url: "", type: "Партнёр", description: ""},
    {title: "Веб-интегратор Максимастер", image: 'https://sun9-48.userapi.com/impf/c623717/v623717886/388d1/uu5qYTjiFWE.jpg?size=475x475&quality=96&sign=6c8b0e80acd7ccea0c307153c2b8bcc2&type=album', url: "https://vk.com/maximast", type: "Партнёр", description: "Разрабатываем технически сложные высоконагруженные веб-проекты. Специализируемся на интернет-магазинах, внутренних порталах, b2b-платформах, CRM. Наш стек: Symfony, 1С-Битрикс, Битрикс24, React.js, Vue.js"},
    {title: "Scloud.ru", image: 'https://sun9-4.userapi.com/impg/c854424/v854424461/179308/Z2vcz0SUFSw.jpg?size=200x200&quality=96&sign=f1bba8a695403a35d87c16bcf4b76cd6&type=album', url: "https://vk.com/scloud", type: "Партнёр", description: "СервисКлауд - официальный партнер компании «1С»."},
    {title: "DD Planet", image: 'https://sun9-1.userapi.com/impf/c841438/v841438551/23180/y6aWfl4pv5E.jpg?size=800x800&quality=96&sign=626f98f2ced8f8d81ad6f2e096e92c14&type=album', url: "https://vk.com/ddplanet", type: "Партнёр", description: "Digital-интегратор DD Planet основан в 2004 году, специализируется на создании digital-сервисов и информационно-аналитических систем. Мы реализуем высоконагруженные веб-проекты, корпоративные порталы и мобильные приложения. Офисы DD Planet расположены в Москве, Туле и Калуге. Сегодня в них работают более 150 сотрудников."},
    {title: "Центр информационных технологий", url: "", type: "Партнёр", description: ""},
    {title: "SafeCafe", image: 'https://sun9-19.userapi.com/impg/d9I-Owl6Ivlyzx8TX6UxTBrdRD1iV9bLawhpoQ/vktLmGvfkz8.jpg?size=500x500&quality=96&sign=f6fc2446345f6aeb7c5e78617f746c24&type=album', url: "https://vk.com/safecafe", type: "Партнёр", description: ""},
    {title: "GDG Russia", image: 'https://sun9-66.userapi.com/impg/L2bfoh8evdzzXIFfsT0R8kz2t247nzwl9wnJNg/l9_ZnMN1qig.jpg?size=1242x1242&quality=96&sign=cdba024ad9bf8e9878f55baa965b48ed&type=album', url: "https://vk.com/gdgrussia", type: "Партнёр", description: "Google Developer Groups - сеть некоммерческих IT-сообществ, в основе которых лежат технологии Google для разработчиков: Android, Chrome, Cloud, Firebase и другие."},
];

class HomePanelBase extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null
        };

        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
    }

    showError(text) {
        if (this.state.snackbar) return;
        this.setState({ snackbar:
        <Snackbar
            layout="vertical"
            onClose={() => this.setState({ snackbar: null })}
            before={<Icon16ErrorCircleFill width={24} height={24} />}
        >
            {text}
        </Snackbar>
        });
    }

    showSuccess(text) {
        if (this.state.snackbar) return;
        this.setState({ snackbar:
        <Snackbar
            layout="vertical"
            onClose={() => this.setState({ snackbar: null })}
            before={<Icon20CheckCircleFillGreen width={24} height={24} />}
        >
            {text}
        </Snackbar>
        });
    }

    componentDidMount() {
    }

    render() {
        const {id, setPage, withoutEpic} = this.props;

        return (
            <Panel id={id}>
            <div style={{ background: 'url(' + background + ')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: window.innerHeight }}>
                <div className="header">
                    <div style={{ display: 'flex', justifyContent: 'center', height: window.innerHeight, alignItems: 'center', flexDirection: 'column' }}>
                    <img
                        alt=""
                        src={vk_logo}
                        style={{ marginRight: 12, width: 125, height: 125, marginBottom: 16 }}
                    />
                    <h1
                    style={{ color: '#ffffff', fontFamily: 'Montserrat', fontWeight: '900', fontSize: 25, margin: 0, textShadow: '0px 0px 15px rgba(0, 0, 0, 0.25)' }}
                    >
                    Вездекод ВКонтакте
                    </h1>
                    <Button onClick={() => {
                        this.showError('К сожалению, регистрация закрыта.');
                    }} size="l" style={{ marginTop: "16px" }}>Зарегистрировать команду</Button>
                    </div>
                </div>
            </div>
            <Div>
                <Title level="1" weight="bold">
                    Что такое Вездекод?
                </Title>
                <Text weight="regular">
                    «Вездекод» — это двухдневный марафон, где можно участвовать в одиночку или командой до четырёх человек. Лучшие участники получат денежный приз — 100.000 рублей.
                    <br/>
                    <br/>
                    Финал пройдёт офлайн в Санкт-Петербурге. Участники, прошедшие отбор, поборются за призовой фонд — 1 000 000 рублей. Команда или участник, занявшие 1-е место, получат 500 000 рублей, 2-е — 300 000, 3-е — 200 000.
                </Text>
            </Div>
            <Div>
                <Title level="1" weight="bold">
                    Организаторы и партнёры
                </Title>
                {items.map((item) => <ContentCard
                    image={item.image}
                    subtitle={item.type}
                    header={item.title}
                    text={item.description}
                    caption={item.url != '' && <Button href={item.url} target="_blank" size="l" stretched>Подробнее</Button>}
                    maxHeight={150}
                    style={{ marginTop: 8, minWidth: 300 }}
                />)}
            </Div>
            {this.state.snackbar}
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage,
    goBack,
    openPopout,
    closePopout,
    openModal
};

export default connect(null, mapDispatchToProps)(HomePanelBase);
