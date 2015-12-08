#!/usr/bin/env python
from django.conf import settings
class Email():
    default_invitation_text = ('Hello, \n\n %s has invited you to create ' + 
        'a Local Ground account, which allows you to create and share hand-drawn and digital maps. ' +
        'Local Ground is a project sponsored by UC Berkeley to encourage the documentation ' +
        'and sharing of knowledge within local communities.  If you are interested, ' +
        'please register for a free account here:  //localground.org/accounts/register/ ' +
        '\n\nThanks!\n\n--The Local Ground Team')
    
    def send_invitation(self, recipients, user, subject=None, body=None): #an array of email address strings
        '''
        Sends an invitation email:
            recipients: an array of email address strings
            user:       the auth.User who is doing the inviting
            body:       text to be emailed
        '''
        import smtplib
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText
        if recipients is None or len(recipients) == 0:
            return False
        
        me              = settings.DEFAULT_FROM_EMAIL
        you             = ', '.join(recipients)
        
        # Create message container - the correct MIME type is multipart/alternative.
        msg             = MIMEMultipart('alternative')
        if subject is None:
            msg['Subject'] = "Invitation to register"
        else:
            msg['Subject'] = subject    
        msg['From']     = me
        msg['To']       = you
        msg['Bcc']      = ','.join(settings.ADMIN_EMAILS)
        
        # Create the body of the message (a plain-text and an HTML version).
        if body is None:
            body = self.default_invitation_text % (user.email)
        
        part1 = MIMEText(body, 'plain')
    
        # Attach parts into message container.
        # According to RFC 2046, the last part of a multipart message, in this case
        # the HTML message, is best and preferred.
        msg.attach(part1)
        
        # Send the message via local SMTP server.
        s = smtplib.SMTP('localhost')
        
        # sendmail function takes 3 arguments: sender's address, recipient's address
        # and message to send - here it is sent as one string.
        recipients.extend(settings.ADMIN_EMAILS)
        s.sendmail(me, recipients, msg.as_string())
        s.quit()
        return True
    
    

