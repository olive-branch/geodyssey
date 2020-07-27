# Установка и запуск Geodyssey

Geodyssey - веб-приложение на VueJS с серверной частью на NodeJS.
В качестве СУБД используется PostgreSQL.

База данных создается автоматически.

Наиболее удобным и быстрым вариантом развертывание системы
является использование [Docker](https://www.docker.com/)
(требуется подключения к Интернет).

## Установка в Docker

В данном варианте установки первым делом необходимо установить
[Docker](https://www.docker.com/) и
[Docker Compose](https://docs.docker.com/compose/install/)

Инструкции по установке для различных ОС можно найти в
[официальной документации Docker](https://docs.docker.com/get-docker/).

### Windows

Docker поддерживается начиная с Windows 10 и выше.

Для простоты установки рекомендуется использовать [Docker Desktop для Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows).

Скачайте и запустите файл, и следуйте инструкциям мастера установки.

Обратите внимание, что запуск Docker может потребовать включить
[поддержку виртуализации Hyper-V и аппаратную поддержку виратуализации через BIOS](https://docs.docker.com/docker-for-windows/troubleshoot/#virtualization-must-be-enabled).

### macOS

Docker поддерживается начиная с macOS 10.13 (High Sierra) и выше, а также
моделями mac старше 2010 года.

Для простоты установки рекомендуется использовать [Docker Desktop для macOS](https://hub.docker.com/editions/community/docker-ce-desktop-mac).

Скачайте и запустите файл, и следуйте инструкциям мастера установки.

### Gentoo (Calculate) Linux

Для установки Docker предлагается использовать менеджер-пакетов Gentoo `emerge`.

Выполните команды:

```
sudo emerge app-emulation/docker
```

```
sudo emerge app-emulation/docker-compose
```

## Запуск системы

При установленом Docker вы можете запустить систему. Для этого:

1. Создайте папку для запуска системы в любом удобном для вас месте (например `geodyssey` в домашней директории).
2. Скачайте файл [docker-compose.yml](https://raw.githubusercontent.com/olive-branch/geodyssey/master/docker-compose.yml?token=AGAS5IPFZOVXQVD4X2Z6F3S7D3FZ4)
   (скачать можно через контекстное меню браузера -> Сохранить Как)
   и поместите в созданную ранее папку.
4. Откройте терминал (Terminal, Командная строка или PowerShell на Windows).
   Перейдите в созданную папку с помощью `cd <путь до папки>`
   или откройте папку в терминале через контекстное меню папки, если возможно).
5. В терминале выполните команду

    ```
    docker-compose up
    ```

В результате система должна быть доступной по адресу http://localhost:8080

## Обновление системы

1. Откройте терминал и перейдите в папку с системой.
2. В терминале выполните команду

    ```
    docker-compose pull

    docker-compose up
    ```

## Установка без Docker

При невозможности или нежелании использовать Docker, возможно запустить систему "вручную".

Для этого:

1. Установите [PostgreSQL](https://www.postgresql.org/)
2. Скачайте [исполняемые файлы Geodyssey](https://github.com/olive-branch/geodyssey/releases) и распакуйте их в удобную для вас директорию
3. Создайте в директории файл `config.json` со следующим содержимым (замените значения на уместные для вас, если требуется):

  ```json
  {
    "port": 8080,
    "db": {
      "host": "localhost",
      "port": 5432,
      "database": "geodyssey",
      "user": "postgres",
      "password": "postgres",
    }
  }
  ```

4. Запустите файл `geodyssey` через терминал

> На момент написания документации исполняемые файлы не были созданы.
>
> Если вам потребуется этот вариант установки, но файлы по прежнему недоступны
> напишите об этом в [Issues](https://github.com/olive-branch/geodyssey/issues)
