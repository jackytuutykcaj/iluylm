import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import './Overview.css'

Modal.setAppElement('#root')

const customStyle = {
    content: {
        top: '25%',
        bottom: '25%',
        left: '25%',
        right: '25%',
        borderRadius: '15px'
    }
}

function Overview({ token }) {
    const [bio, setBio] = useState(``);
    const [modalIsOpen, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [uid, setID] = useState('');
    const [error, setError] = useState('');
    const [profilePicID, setProfilePicID] = useState('default.png');
    const url = "http://153.92.214.195:8082/";

    useEffect(() => {
        fetchData('http://153.92.214.195:8080/getprofile', { token })
            .then((data) => {
                var username = data.username;
                var _id = data._id;
                setUsername(username);
                setID(_id);
                fetchData('http://153.92.214.195:8082/getbio', { _id })
                    .then(data => {
                        setBio(data.bio);
                    })
                fetchData('http://153.92.214.195:8082/getimage', { username })
                    .then(result => {
                        if (result.exists) {
                            setProfilePicID(result.name + '.png');
                            fetchData('http://153.92.214.195:8082/getposts', { _id })
                                .then(data => {
                                    showPosts(data, username, result.name + '.png');
                                })
                        }
                    })
            })
    }, [])

    function submitPost(e) {
        e.preventDefault();
        var postarea = document.getElementById('Postarea')
        var postvalue = postarea.value
        if (postvalue.length > 0) {
            var date = moment().format("YYYY-M-D HH:mm");
            fetchData('http://153.92.214.195:8082/createpost', { date, postvalue, uid });
            var posts = document.getElementById('posts');
            var post = document.createElement('li');
            var name_date = document.createElement('div');
            name_date.id = 'name_date';
            var pic = document.createElement('img');
            pic.id = 'pic';
            pic.src = url + profilePicID;
            var name = document.createElement('h4');
            name.textContent = username;
            name.id = 'name';
            var postdate = document.createElement('h6');
            postdate.textContent = date
            postdate.id = 'date';
            name_date.appendChild(pic);
            name_date.appendChild(name);
            name_date.appendChild(postdate);
            post.appendChild(name_date);
            var context = document.createElement('p');
            context.textContent = postvalue;
            context.id = 'context';
            post.appendChild(context);
            posts.appendChild(post);
            posts.insertBefore(post, posts.firstChild)
        }
        postarea.value = "";
    }

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
    }

    function updateBio() {
        var element = document.getElementById('editBio');
        var contents = element.value;
        if (element.value != '') {
            fetchData('http://153.92.214.195:8082/setbio', { contents, uid })
                .then((result) => {
                    setBio(contents);
                    closeModal();
                    setError('');
                })
        } else {
            setError(`Can not be empty.`);
        }
    }

    function showPosts(data, username, profilePicID) {
        data.reverse().forEach(element => {
            var posts = document.getElementById('posts');
            var post = document.createElement('li');
            var name_date = document.createElement('div');
            name_date.id = 'name_date';
            var pic = document.createElement('img');
            pic.id = 'pic';
            pic.src = url + profilePicID;
            var name = document.createElement('h4');
            name.textContent = username;
            name.id = 'name';
            var date = document.createElement('h6');
            date.textContent = element.date
            date.id = 'date';
            name_date.appendChild(pic);
            name_date.appendChild(name);
            name_date.appendChild(date);
            post.appendChild(name_date);
            var context = document.createElement('p');
            context.textContent = element.post;
            context.id = 'context';
            post.appendChild(context);
            posts.appendChild(post);
        })
    }

    async function fetchData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return response.json()
    }

    return (
        <div className='Overview'>
            <h2>Overview</h2>
            <div className='bioandpost'>
                <h3>Bio</h3>
                <p className='Bio'>{bio} <i className='fa fa-pencil' id='pencil' onClick={openModal} /></p>
                <h3>Post</h3>
                <form>
                    <textarea className='Postarea' id='Postarea'></textarea><br />
                    <button onClick={submitPost}>Post</button>
                </form>
                <div className='listofposts'>
                    <ul className='posts' id='posts'>

                    </ul>
                </div>
            </div>
            <div className='Friends'>
                <h3>Friends</h3>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyle}>
                <div className='editBioModal'>
                    <h3>Edit Bio</h3>
                    <textarea className='editBio' id='editBio' defaultValue={bio}></textarea><br />
                    <button onClick={updateBio}>Submit</button>
                    <p>{error}</p>
                </div>
            </Modal>
        </div>
    )
}

export default Overview;