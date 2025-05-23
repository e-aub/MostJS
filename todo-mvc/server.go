package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fileContent, err := os.ReadFile("./src/index.html")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "text/html")
		_, err = w.Write(fileContent)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	http.Handle("/assets/", http.StripPrefix("/assets", (http.FileServer(http.Dir("./src/")))))
	http.Handle("/mostJS/", http.StripPrefix("/mostJS", (http.FileServer(http.Dir("../mostJS/")))))
	fmt.Println("Server running at http://localhost:8000")
	http.ListenAndServe(":8000", nil)
}
