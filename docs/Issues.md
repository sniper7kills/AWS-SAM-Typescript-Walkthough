This page is where I will discuss issues and my personal opinion on them.
# Issue 1
**Application Compose generates boiler plate too quickly!**

I get it; I drag and dropped a Lambda funtion onto the grid; but you **NEVER** gave me a chance to customize any settings about the functions location, runtime language or anything.

At a **Minimum** I'd expect to be required to name the Lambda function before it's actually added to the grid; but nope, lets just call it "Function" and throw some code into "src/Function" because you dropped that.

And then when I finally do select or change the runtime does it "clean up" existing boiler plate? Nope. While I can justify this as not wanting to delete something that a user created/modified when I'm just starting out and testing this creates multiple copies of files overwriting files if they already exist.

While I'm sure there is some magic because it did choose a "typescript" function compared to a "python" function; that magic leaves much to be desired.

# Issue 2
**Boiler Plate doesn't match expected code from "hello world"**

I can't explain this one; and it actually makes me a little mad. Why does the hello world typescript project use a template that can't be automagically created? Do I really have to copy/paste all of these files and just disregard the boiler plate code?

I nievely thought that "Oh maybe I can customize this within VS Code and provide my own template". But nope. Can't do that.

# Issue 3
**We see nothing because it didn't provide us with anything.**

I can overcome the [Issue 2](#issue-2) but to not have any boiler plate code for a lambda layer and forcing people to figure it out doesn't help for adoption, or ease of use.

Maybe... If I could provide custom boiler plates for Application Composer components this could be a non-issue? Just a thought.