import { Div, H1, P, Link } from '../../mostJS/index.js';

export default function NotFoundHandler () {
    document.title = "404 - Page Not Found";
    return Div({ 
      className: "not-found", 
      style: { 
        width: "100%", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        color: "#111",
        font: "14px Helvetica Neue, Helvetica, Arial, sans-serif"
      } 
    }, [
      H1({ style: { color: "#b83f45", fontSize: "80px", fontWeight: "200", margin: "0" } }, "404 - Page Not Found"),
      P({ style: { fontSize: "24px", margin: "20px 0" } }, "The page you are looking for does not exist or has been moved."),
      Div({ className: "actions" }, [
        Link({ 
          href: "/", 
          className: "home-link", 
          style: { 
            display: "inline-block",
            padding: "10px 20px",
            marginTop: "20px",
            border: "1px solid #999",
            textDecoration: "none",
            color: "#111",
            fontSize: "18px",
            transition: "all 0.3s ease"
          },
          onmouseover: function (e) {
            e.target.style.background = "#b83f45";
            e.target.style.color = "#fff";
            e.target.style.borderColor = "#b83f45";
          },
          onmouseout: function (e) {
            e.target.style.background = "none";
            e.target.style.color = "#111";
            e.target.style.borderColor = "#999";
          }
        }, "Go back to Home")
      ])
    ]);   
}