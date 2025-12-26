import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Loader2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { endpoints } from '../api/client';
import { ApiPhone } from '../api/types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

export function AdminAffiliatePage() {
  const [allPhones, setAllPhones] = useState<ApiPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [urls, setUrls] = useState({ amazon: '', flipkart: '' });

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await endpoints.searchAll(1, 500);
        setAllPhones(res.data.data);
      } catch (err) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Robust check: Ensure property exists, is not null, and not an empty string
  const getLinkStatus = (phone: ApiPhone) => {
    const hasAmazon = !!phone.affiliate_links?.amazon && phone.affiliate_links.amazon.length > 5;
    const hasFlipkart = !!phone.affiliate_links?.flipkart && phone.affiliate_links.flipkart.length > 5;
    return hasAmazon && hasFlipkart;
  };

  const toggleExpand = (phone: ApiPhone) => {
    if (expandedId === phone._id) {
      setExpandedId(null);
    } else {
      setExpandedId(phone._id);
      setUrls({
        amazon: phone.affiliate_links?.amazon || '',
        flipkart: phone.affiliate_links?.flipkart || ''
      });
    }
  };

  const handleUpdate = async (phoneId: string, retailer: 'amazon' | 'flipkart') => {
    const url = urls[retailer];
    if (!url.startsWith('http')) {
      toast.error('Please enter a valid URL');
      return;
    }

    setUpdating(retailer);
    try {
      await (endpoints as any).affiliate.update(phoneId, retailer, url);
      toast.success(`${retailer} link updated!`);
      
      setAllPhones(prev => prev.map(p => 
        p._id === phoneId 
          ? { ...p, affiliate_links: { ...p.affiliate_links, [retailer]: url } }
          : p
      ));
    } catch (err: any) {
      toast.error('Failed to update link');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - Centered */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Affiliate Link Manager</h1>
          <p className="text-gray-500 mt-2">Manage store redirects for {allPhones.length} devices</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
            <p className="font-medium text-gray-600">Syncing products...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allPhones.map((phone) => {
              const isComplete = getLinkStatus(phone);
              const isExpanded = expandedId === phone._id;

              return (
                <div key={phone._id} className="w-full">
                  {/* DEVICE ROW */}
                  <button
                    onClick={() => toggleExpand(phone)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 bg-white border rounded-xl transition-all shadow-sm relative overflow-hidden",
                      isComplete 
                        ? "border-emerald-200 hover:bg-emerald-50/30" 
                        : "border-rose-300 bg-rose-50/40 hover:bg-rose-50", // High visibility red border/bg
                      isExpanded && "ring-2 ring-gray-900 ring-offset-2"
                    )}
                  >
                    {/* Visual Status Bar (Vertical) */}
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1.5",
                      isComplete ? "bg-emerald-500" : "bg-rose-600"
                    )} />

                    <div className="flex items-center gap-4 pl-2">
                      <div className="w-10 h-10 bg-white border border-gray-100 rounded p-1 flex-shrink-0">
                        <ImageWithFallback src={phone.image} className="w-full h-full object-contain" />
                      </div>

                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">
                          {phone.model_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {isComplete ? (
                            <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> READY
                            </span>
                          ) : (
                            <span className="text-rose-700 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                              <AlertCircle className="h-3 w-3" /> ACTION REQUIRED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={cn(
                      "transition-transform duration-200",
                      isExpanded ? "rotate-180 text-gray-900" : "text-gray-400"
                    )}>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>

                  {/* EXPANDED PANEL */}
                  {isExpanded && (
                    <div className={cn(
                      "mt-1 rounded-xl border-x border-b p-4 md:p-6 bg-white animate-in slide-in-from-top-2 duration-200",
                      isComplete ? "border-emerald-200" : "border-rose-200"
                    )}>
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        
                        {/* Compact Image Area */}
                        <div className="flex flex-row md:flex-col items-center gap-4 w-full md:w-32">
                          <div className="w-20 h-24 bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center justify-center shrink-0">
                            <ImageWithFallback src={phone.image} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1">
                             <p className="text-[10px] text-gray-400 font-mono uppercase truncate">ID: {phone._id}</p>
                             <Badge variant="secondary" className="mt-1 text-[10px] whitespace-nowrap">
                               {phone.brand}
                             </Badge>
                          </div>
                        </div>

                        {/* Editor Forms */}
                        <div className="flex-1 w-full space-y-5">
                          {/* Flipkart Input */}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-bold text-gray-600">
                              <img src="https://www.google.com/s2/favicons?domain=flipkart.com&sz=128" className="w-4 h-4" alt=""/>
                              FLIPKART LINK
                            </Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <div className="relative flex-1">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                <Input 
                                  value={urls.flipkart}
                                  onChange={(e) => setUrls({...urls, flipkart: e.target.value})}
                                  className="pl-9 h-10 bg-gray-50 focus:bg-white text-sm rounded-lg mt-2"
                                  placeholder="Paste Flipkart link here..."
                                />
                              </div>
                              <Button 
                                size="sm"
                                className={cn(
                                  "h-10 px-6 font-bold",
                                  isComplete ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                                )}
                                onClick={() => handleUpdate(phone._id, 'flipkart')}
                                disabled={updating !== null}
                              >
                                {updating === 'flipkart' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Link'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}