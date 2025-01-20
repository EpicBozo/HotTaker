import plusMark from "./assets/plusMark.svg";

function Header() {
  return (
    <header>
      <nav>
        <home>
          <a href="#">Hot Takers</a>
        </home>
        <search>
          <input type="text" placeholder="Search Topics" />
        </search>
        <right-nav>
          <feed>
            <a href="#">Feed</a>
          </feed>
          <post>
            <img src={plusMark} alt="plus" />
            <p>Post</p>
          </post>
        </right-nav>
      </nav>
      <hr></hr>
    </header>
  );
}

export default Header;
