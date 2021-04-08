import React, { Component } from 'react';
import Pelicula from './Pelicula';
import Slider from './Slider';
import Sidebar from './Sidebar';



class Peliculas extends Component {
    state = {};

    cambiarTitulo = () => {

        var { peliculas } = this.state;
        // var random = Math.floor(Math.random() * 3);
        peliculas[0].titulo = "Donald Darko"

        this.setState({
            peliculas: peliculas
        });
    }

    favorita = (pelicula) => {
        console.log("FAVORITA MARCADA");
        console.log(pelicula);
        this.setState({
            favorita: pelicula
        });
    }

    componentWillMount() {
        this.setState({
            peliculas: [
                { titulo: 'Donnie Darko', image: 'https://winchesterdotblog.files.wordpress.com/2017/10/daac639abba0bad403c26791cf998f83-donnie-darko-hd-wallpaper.jpg?w=775' },
                { titulo: 'Mr. Nobody', image: 'https://i.pinimg.com/originals/f8/8f/d4/f88fd4d84413f8ff5e7a7627f1f1fb90.jpg' },
                { titulo: 'Big Fish', image: 'https://www.dhresource.com/0x0/f2/albu/g9/M01/74/35/rBVaWFv1PYOAflvaAAMM6WK75do727.jpg/big-fish-movie-film-2003-tim-burton-ewan.jpg' }
            ],
            nombre: 'Juanma Pereyra',
            favorita: {}
        })
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        var pStyle = {
            background: 'green',
            color: 'white',
            padding: '10px'
        };

        return (
            <React.Fragment>
                <Slider
                    title="Peliculas"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content" className="peliculas">

                        <h2 className="subheader">Listado de Peliculas</h2>
                        <p>Seleccion de las peliculas favoritas de {this.state.nombre}</p>

                        <p><button onClick={this.cambiarTitulo}>Cambiar Titulos primera pelicula</button></p>

                        {this.state.favorita.titulo &&
                            <p className="favorita" style={pStyle} >
                                <strong>La pelicula favorita es: </strong>
                                <span>{this.state.favorita.titulo}</span>
                            </p>
                        }

                        {/*Crear compoente de peliculas*/}

                        <div id="articles" className="peliculas">
                            {
                                this.state.peliculas.map((pelicula, i) => {
                                    return (
                                        <Pelicula
                                            key={i}
                                            pelicula={pelicula}
                                            marcarFavorita={this.favorita}
                                        />
                                    )
                                })
                            }

                        </div>

                    </div>
                    <Sidebar


                    />

                </div>

            </React.Fragment>
        );
    }

}

export default Peliculas;