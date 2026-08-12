import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Mail, Send, Users, CheckCircle2 } from 'lucide-react';
import { useSchool } from './SchoolContext';
import { cn } from '../../../lib/utils';

interface ParentContact {
  id: string;
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
}

export function SchoolCommunicationCenter() {
  const { students } = useSchool();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedParent, setSelectedParent] = useState<ParentContact | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [sent, setSent] = useState(false);
  const [channel, setChannel] = useState<'email' | 'sms'>('email');

  const parentContacts: ParentContact[] = students.map(s => ({
    id: s.id,
    parentName: s.guardian,
    studentName: s.name,
    email: s.email,
    phone: s.phone
  })).filter(c => channel === 'email' ? c.email : c.phone); // Filter based on selected channel

  const handleSelectParent = (contact: ParentContact) => {
    setSelectedParent(contact);
    setRecipient(channel === 'email' ? contact.email : contact.phone);
    setShowDropdown(false);
  };

  const handleSend = () => {
    if (recipient && message && (channel === 'sms' || subject)) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setSubject('');
        setMessage('');
        setRecipient('');
        setSelectedParent(null);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Communication Center</h2>
          <p className="text-slate-500 mt-1">Send updates and emails to parents and staff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Compose Message</CardTitle>
              <div className="flex bg-slate-100 p-1 rounded-md">
                <button
                  className={cn("px-3 py-1 text-sm font-medium rounded-md transition-colors", channel === 'email' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900")}
                  onClick={() => {
                    setChannel('email');
                    setRecipient('');
                  }}
                >
                  Email
                </button>
                <button
                  className={cn("px-3 py-1 text-sm font-medium rounded-md transition-colors", channel === 'sms' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900")}
                  onClick={() => {
                    setChannel('sms');
                    setRecipient('');
                  }}
                >
                  SMS
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sent && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{channel.toUpperCase()} successfully sent to {recipient}!</span>
                </div>
              )}
              
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-slate-700">Recipient ({channel === 'email' ? 'Parent Email' : 'Parent Phone'})</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder={`Select or enter ${channel === 'email' ? 'email address' : 'phone number'}...`}
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                  />
                  <Button variant="outline" onClick={() => setShowDropdown(!showDropdown)}>
                    <Users className="w-4 h-4 mr-2" /> Contacts
                  </Button>
                </div>
                
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                    <div className="p-2 text-xs font-semibold text-slate-500 bg-slate-50 border-b">Saved Parent Contacts</div>
                    {parentContacts.map(contact => (
                      <div 
                        key={contact.id} 
                        className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0"
                        onClick={() => handleSelectParent(contact)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-900">{contact.parentName}</span>
                          <span className="text-sm text-slate-500">{contact.email}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Parent of: {contact.studentName}</div>
                      </div>
                    ))}
                    {parentContacts.length === 0 && (
                      <div className="p-4 text-center text-sm text-slate-500 italic">No parent contacts found with an email address.</div>
                    )}
                  </div>
                )}
              </div>
              
              {channel === 'email' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subject</label>
                  <Input 
                    placeholder="e.g., End of Term Report, School Fees Reminder" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea 
                  className="w-full h-48 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={channel === 'sms' ? 160 : undefined}
                />
                {channel === 'sms' && (
                  <div className="text-xs text-slate-500 text-right">{message.length}/160 characters</div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSend} disabled={!recipient || !message || (channel === 'email' && !subject)}>
                  <Send className="w-4 h-4 mr-2" /> Send {channel === 'email' ? 'Email' : 'SMS'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'School Fees Reminder', subject: 'Important: Outstanding School Fees', preview: 'Dear Parent, this is a gentle reminder regarding...' },
                { title: 'PTA Meeting Notice', subject: 'Invitation to Upcoming PTA Meeting', preview: 'We cordially invite you to our next PTA...' },
                { title: 'End of Term Report', subject: 'Student Performance Report Available', preview: 'Your ward\'s performance report for the term is...' },
              ].map((template, idx) => (
                <div 
                  key={idx} 
                  className="p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSubject(template.subject);
                    setMessage(template.preview);
                  }}
                >
                  <div className="font-medium text-slate-900 text-sm mb-1">{template.title}</div>
                  <div className="text-xs text-slate-500 truncate">{template.preview}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Bulk Messaging</h3>
              <p className="text-sm text-slate-300 mb-4">
                Want to send announcements to all parents at once? Use the broadcast feature.
              </p>
              <Button variant="outline" className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                Broadcast Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
