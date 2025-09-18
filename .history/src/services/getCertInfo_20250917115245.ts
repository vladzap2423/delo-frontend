// utils/getCertInfo.ts
// @ts-ignore
declare const cadesplugin: any;

async function waitForCadesPlugin(timeout = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsed = 0;
    const interval = 100;
    const timer = setInterval(() => {
      if (typeof window !== "undefined" && "cadesplugin" in window) {
        clearInterval(timer);
        resolve();
      }
      elapsed += interval;
      if (elapsed >= timeout) {
        clearInterval(timer);
        reject(new Error("CryptoPro Cades Plugin не найден или не загружен"));
      }
    }, interval);
  });
}

export interface CertInfo {
  subjectName: string;
  issuerName: string;
  validFrom: string;
  validTo: string;
  thumbprint: string;
}

export async function getCertificateInfo(): Promise<CertInfo | null> {
  await waitForCadesPlugin();

  return new Promise((resolve, reject) => {
    cadesplugin.async_spawn(function* (): any {
      try {
        const store = yield cadesplugin.CreateObjectAsync("CAdESCOM.Store");
        yield store.Open();
        const certs = yield store.Certificates;
        if ((yield certs.Count) === 0) {
          resolve(null);
          return;
        }

        const cert = yield certs.Item(1);
        const subjectName = yield cert.SubjectName;
        const issuerName = yield cert.IssuerName;
        const validFrom = yield cert.ValidFromDate;
        const validTo = yield cert.ValidToDate;
        const thumbprint = yield cert.Thumbprint;

        yield store.Close();

        resolve({ subjectName, issuerName, validFrom, validTo, thumbprint });
      } catch (err) {
        reject(err);
      }
    });
  });
}
