// services/cades.service.ts

declare global {
  interface Window {
    cadesplugin: any;
  }
}

export async function getCertificateInfo(): Promise<string> {
  return new Promise((resolve, reject) => {
    const cadesplugin = window.cadesplugin;
    if (!cadesplugin) {
      reject("CaDES plugin не найден");
      return;
    }

    cadesplugin.async_spawn(function* (args: unknown): Generator<any, > {
      try {
        const store = yield cadesplugin.CreateObjectAsync("CAdESCOM.Store");
        yield store.Open(
          cadesplugin.CAPICOM_CURRENT_USER_STORE,
          cadesplugin.CAPICOM_MY_STORE,
          cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
        );

        const certs = yield store.Certificates;
        const count = yield certs.Count;
        if (count === 0) {
          reject("Нет доступных сертификатов");
          return;
        }

        const cert = yield certs.Item(1); // берем первый сертификат
        const subjectName = yield cert.SubjectName;
        const issuerName = yield cert.IssuerName;
        const validFrom = yield cert.ValidFromDate;
        const validTo = yield cert.ValidToDate;

        const info = `Владелец: ${subjectName}\nВыдан: ${issuerName}\nДействует: ${validFrom} - ${validTo}`;

        resolve(info);
        yield store.Close();
      } catch (err: any) {
        reject("Ошибка при получении сертификата: " + err.message);
      }
    });
  });
}
