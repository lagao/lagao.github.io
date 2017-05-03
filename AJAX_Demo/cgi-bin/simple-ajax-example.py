import cgi

form = cgi.FieldStorage()
secret_word = form.getvalue('word')

print "Content-type: text/html"
print ""
print "<p>The secret word is", secret_word, "<p>"