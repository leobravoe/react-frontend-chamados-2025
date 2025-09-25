const posts = [
    { id: 1, autor: "Ana", texto: "Primeiro post!" },
    { id: 2, autor: "Leo", texto: "React é top!" },
    { id: 3, autor: "asdasd", texto: "adasdasdasdasdasda" },
    { id: 4, autor: "asdasdasd", texto: "asdasdasdasdasdasd" },
    { id: 5, autor: "asdasdasda", texto: "zczxczczxczxcxzxczxc" },
];
const Post = ({ autor, texto }) => {
    return (
        <aticle>
            <strong>{autor}</strong>
            <p>{texto}</p>
        </aticle>
    )
}
const Feed = () => {
    // return posts.map(post => <Post key={post.id} {...post} />);
      return posts.map(post => <Post key={post.id} id={post.id} autor={post.autor} texto={post.texto} />);
}
export default Feed