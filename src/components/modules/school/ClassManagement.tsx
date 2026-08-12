import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Plus, Users, Calendar, Check, X, FileText, Search, GraduationCap } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const SCHOOL_CLASSES = [
  'KG 1', 'KG 2', 
  'Nursery 1', 'Nursery 2', 
  'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
];

export function ClassManagement() {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Class Management</h2>
          <p className="text-slate-500 mt-1">Manage and configure school classes and levels.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Add Custom Class</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg">Kindergarten</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {['KG 1', 'KG 2'].map(cls => (
                <div key={cls} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">{cls.substring(0, 3)}</div>
                    <span className="font-medium text-slate-900">{cls}</span>
                  </div>
                  <Badge variant="outline" className="bg-white">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg">Nursery</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {['Nursery 1', 'Nursery 2'].map(cls => (
                <div key={cls} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{cls.substring(0, 3)}</div>
                    <span className="font-medium text-slate-900">{cls}</span>
                  </div>
                  <Badge variant="outline" className="bg-white">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg">Primary / Basic</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'].map(cls => (
                <div key={cls} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">{cls.substring(0, 3)}</div>
                    <span className="font-medium text-slate-900">{cls}</span>
                  </div>
                  <Badge variant="outline" className="bg-white">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
