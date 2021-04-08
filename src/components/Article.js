import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert';
import Global from '../Global';
import Sidebar from './Sidebar';
import Moment from 'react-moment';
import 'moment/locale/es';
import ImageDefault from '../assets/images/default.jpg';

class Article extends Component {

    url = Global.url;

    state = {
        article: false,
        status: null
    };

    componentDidMount() {
        this.getArticle();
    }

    getArticle = () => {
        var id = this.props.match.params.id;

        axios.get(this.url + '/article/' + id)
            .then(res => {
                this.setState({
                    article: res.data.article,
                    status: 'success'
                });
            }).catch(err => {
                this.setState({
                    articles: false,
                    status: 'success'
                });
            });
    }

    deleteArticle = (id) => {

        swal({
            title: "Esta seguro?",
            text: "Borrarás permanentemente tu articulo!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(this.url + 'article/' + id)
                        .then(res => {

                            this.setState({
                                article: res.data.article,
                                status: 'delete'
                            });

                            swal(
                                'Articulo Borrado',
                                'El articulo ha sido borrado correctamente',
                                'success'
                            )

                        });
                } else {
                    swal(
                        'Tranquiloo!!',
                        'No se ha borrado nada ;)',
                        'success'
                    )
                }
            });
        /*
                axios.delete(this.url + 'article/' + id)
                    .then( res => {
        
                        this.setState({
                            article: res.data.article,
                            status: 'delete'
                        });
        
                        swal(
                            'Articulo Borrado',
                            'El articulo ha sido Borrado correctamente',
                            'success'
                        )
        
                    });
                    */
    }

    render() {

        if (this.state.status === 'delete') {
            return <Redirect to="/blog" />
        }

        var article = this.state.article;

        return (
            <div className="center">
                <section id="content">

                    {article &&
                        <article className="article-item article-detail">
                            <div className="image-wrap">
                                {
                                    article.image !== null ? (
                                        <img src={this.url + 'get-image/' + article.image} alt={article.title} />
                                    ) : (
                                        <img src={ImageDefault} alt={article.title} />
                                    )
                                }
                            </div>

                            <h1 className="subheader">{article.title}</h1>
                            <span className="date">
                                <Moment locale='es' fromNow>{article.date}</Moment>
                            </span>
                            <p>
                                {article.content}
                            </p>

                            <button onClick={

                                () => {
                                    this.deleteArticle(article._id)
                                }

                            }

                                className="btn btn-danger">Eliminar</button>
                            <Link to={'/blog/editar/'+article._id} className="btn btn-warning">Editar</Link>

                            <div className="clearfix"></div>
                        </article>
                    }

                    {!article && this.state.status === 'success' &&
                        <div id="article">
                            <h2 className="subheader">El articulo no existe!</h2>
                            <p>Intentalo de nuevo más tarde</p>
                        </div>
                    }

                    {this.state.status == null &&
                        <div id="article">
                            <h2 className="subheader">El articulo esta cargando!!</h2>
                            <p>Espere un momento...</p>
                        </div>
                    }


                </section>

                <Sidebar />


            </div>

        );
    }
}

export default Article;