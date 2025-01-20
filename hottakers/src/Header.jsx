import plusMark from "./assets/plusMark.svg";

function Header() {
  function handleClick() {
    console.log("anything");
  }
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
          <div className="post" onClick={handleClick}>
            <img src={plusMark} alt="plus" />
            <p>Post</p>
          </div>
        </right-nav>
      </nav>
      <hr></hr>
    </header>
  );
}

export default Header;
