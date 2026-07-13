"use client";

import React, { useState, useEffect, useRef } from 'react';
import { QrCode, X, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface QrScannerButtonProps {
  className?: string;
  position?: 'above' | 'below';
}

export function QrScannerButton({ className, position = 'above' }: QrScannerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; isError?: boolean } | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = 'qr-reader';

  const startScanner = async () => {
    setIsOpen(true);
    setScanResult(null);
    setIsScanning(true);
    
    setTimeout(async () => {
      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(scannerElementId);
        }
        
        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          async (decodedText) => {
            // Stop scanning once we get a code
            await stopScanner();
            verifyQrCode(decodedText);
          },
          (errorMessage) => {
            // Ignore normal scanning errors
          }
        );
      } catch (err) {
        console.error("Error starting scanner", err);
        toast.error("Impossible d'accéder à la caméra. Vérifiez les permissions.");
        setIsOpen(false);
        setIsScanning(false);
      }
    }, 100);
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner", err);
      }
    }
    setIsScanning(false);
  };

  const verifyQrCode = async (commercantId: string) => {
    try {
      setScanResult({ success: true, message: "Vérification en cours..." });
      
      const response = await api.get(`/paiements/verify/${commercantId}`);
      const data = response.data.data;
      
      if (data.paid_today) {
        setScanResult({ 
          success: true, 
          message: `Payé ! ${data.commercant.nom} a une transaction valide aujourd'hui.` 
        });
        toast.success(`Le commerçant ${data.commercant.nom} a payé aujourd'hui.`);
      } else {
        setScanResult({ 
          success: false, 
          message: `Non payé. ${data.commercant.nom} n'a aucune transaction valide aujourd'hui.` 
        });
        toast.error(`Aucun paiement trouvé pour ${data.commercant.nom} aujourd'hui.`);
      }
      
      setTimeout(() => {
        closeModal();
      }, 4000);
      
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || "Erreur lors de la vérification";
      setScanResult({ success: false, message: errorMessage, isError: true });
      toast.error(errorMessage);
      
      setTimeout(() => {
        closeModal();
      }, 4000);
    }
  };

  const closeModal = async () => {
    await stopScanner();
    setIsOpen(false);
    setScanResult(null);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <>
      <button
        onClick={startScanner}
        className={`w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all z-40 ${className}`}
        aria-label="Scanner QR"
      >
        <QrCode size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <QrCode size={20} />
                Scan QR Code
              </h3>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-muted transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              {!scanResult ? (
                <>
                  <div className="w-full max-w-[300px] aspect-square rounded-xl overflow-hidden bg-black relative mb-4">
                    <div id={scannerElementId} className="w-full h-full object-cover"></div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Placez le QR Code du commerçant dans le cadre pour vérifier ses paiements du jour.
                  </p>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                  {scanResult.message === "Vérification en cours..." ? (
                    <>
                      <Loader2 size={48} className="text-primary animate-spin mb-4" />
                      <p className="font-medium text-lg">{scanResult.message}</p>
                    </>
                  ) : scanResult.success ? (
                    <>
                      <CheckCircle2 size={64} className="text-green-500 mb-4" />
                      <p className="font-bold text-xl text-green-600 mb-2">Payé</p>
                      <p className="text-muted-foreground">{scanResult.message}</p>
                    </>
                  ) : (
                    <>
                      <XCircle size={64} className="text-destructive mb-4" />
                      <p className="font-bold text-xl text-destructive mb-2">Non Payé</p>
                      <p className="text-muted-foreground">{scanResult.message}</p>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-muted/50 border-t border-border flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-background border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
